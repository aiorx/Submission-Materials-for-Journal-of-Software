# Aided with basic GitHub coding tools

"""
VAS Vietnam ChromaDB Ingestion
Thêm tất cả chunks từ vas_vietnam_chunked.json vào ChromaDB thông qua MCP tools
"""

import json
import requests
import time
from pathlib import Path


def load_vas_chunks():
    """Load chunks từ file JSON"""
    json_file = Path(__file__).parent / "vas_vietnam_chunked.json"

    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data


def add_chunks_via_mcp_tools(chunks_data):
    """Thêm chunks vào ChromaDB qua MCP tools HTTP API"""

    chunks = chunks_data["chunks"]
    mcp_endpoint = "http://localhost:3000"

    print(f"🔄 Đang thêm {len(chunks)} chunks vào ChromaDB...")

    batch_size = 5  # Giảm batch size để tránh lỗi
    success_count = 0
    failed_batches = []

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]

        # Chuẩn bị dữ liệu cho batch
        documents = []
        metadatas = []
        ids = []

        for chunk in batch:
            # Tạo document text
            doc_text = f"{chunk['title']}\n\n{chunk['content']}"
            documents.append(doc_text)

            # Tạo metadata (làm sạch các giá trị None)
            metadata = {
                "id": chunk["id"],
                "type": chunk["type"],
                "title": chunk["title"],
                "keywords": ",".join(chunk["metadata"].get("keywords", [])),
                "importance": chunk["metadata"].get("importance", "medium"),
                "section_type": chunk["metadata"].get("section_type", "unknown"),
                "legal_status": chunk["metadata"].get("legal_status", "active"),
            }

            # Thêm standard_number nếu có
            if chunk.get("standard_number") is not None:
                metadata["standard_number"] = chunk["standard_number"]

            # Thêm section_title nếu có
            if chunk["metadata"].get("section_title"):
                metadata["section_title"] = chunk["metadata"]["section_title"]

            metadatas.append(metadata)
            ids.append(chunk["id"])

        # Gọi MCP tool để thêm vào ChromaDB
        try:
            # URL đúng cho MCP tools
            url = f"{mcp_endpoint}/mcp/tools/mcp_tools-mcp_chromadb_chromadb_add_documents"

            payload = {
                "collectionName": "vas_vietnam_2025",
                "documents": documents,
                "metadatas": metadatas,
                "ids": ids,
            }

            response = requests.post(url, json=payload, timeout=30)

            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    success_count += len(batch)
                    print(
                        f"✅ Batch {i//batch_size + 1}/{(len(chunks) + batch_size - 1)//batch_size}: Thêm {len(batch)} chunks"
                    )
                else:
                    print(
                        f"❌ Batch {i//batch_size + 1}: Response không thành công - {result}"
                    )
                    failed_batches.append(i // batch_size + 1)
            else:
                print(
                    f"❌ Batch {i//batch_size + 1}: HTTP {response.status_code} - {response.text}"
                )
                failed_batches.append(i // batch_size + 1)

        except Exception as e:
            print(f"❌ Batch {i//batch_size + 1}: Exception - {e}")
            failed_batches.append(i // batch_size + 1)

        # Nghỉ một chút giữa các batch
        time.sleep(0.5)

    print(f"\n🎉 Hoàn thành! Đã thêm {success_count}/{len(chunks)} chunks")
    if failed_batches:
        print(f"❌ Các batch thất bại: {failed_batches}")

    return success_count


def test_semantic_search_comprehensive():
    """Test tìm kiếm ngữ nghĩa toàn diện"""
    print("\n🔍 Testing comprehensive semantic search...")

    mcp_endpoint = "http://localhost:3000"

    test_queries = [
        "chuẩn mực chung về kế toán",
        "hàng tồn kho đánh giá và ghi nhận",
        "tài sản cố định hữu hình khấu hao",
        "tài sản cố định vô hình",
        "bất động sản đầu tư",
        "thuê tài sản hoạt động",
        "báo cáo tài chính hợp nhất",
        "thuế thu nhập doanh nghiệp",
        "doanh thu và thu nhập khác",
        "chi phí đi vay vốn hóa",
    ]

    for query in test_queries:
        try:
            url = f"{mcp_endpoint}/mcp/tools/mcp_tools-mcp_chromadb_chromadb_query"
            payload = {
                "collectionName": "vas_vietnam_2025",
                "queryTexts": [query],
                "nResults": 2,
                "includeMetadata": True,
                "includeDistances": True,
            }

            response = requests.post(url, json=payload, timeout=10)

            if response.status_code == 200:
                results = response.json()
                print(f"\n📋 Query: '{query}'")

                if (
                    results.get("results", {}).get("documents")
                    and results["results"]["documents"][0]
                ):
                    docs = results["results"]["documents"][0]
                    metadatas = results["results"]["metadatas"][0]
                    distances = results["results"]["distances"][0]

                    for j, doc in enumerate(docs):
                        metadata = metadatas[j]
                        distance = distances[j]
                        title = metadata.get("title", "Unknown")
                        standard_num = metadata.get("standard_number", "N/A")
                        print(f"  {j+1}. {title}")
                        print(
                            f"     Chuẩn mực: {standard_num}, Distance: {distance:.3f}"
                        )
                        print(f"     Preview: {doc[:100]}...")
                else:
                    print("     Không tìm thấy kết quả")
            else:
                print(f"❌ Query failed: {response.status_code} - {response.text}")

        except Exception as e:
            print(f"❌ Error testing query '{query}': {e}")


def get_collection_stats():
    """Lấy thống kê collection"""
    print("\n📊 Collection Statistics...")

    mcp_endpoint = "http://localhost:3000"

    try:
        url = f"{mcp_endpoint}/mcp/tools/mcp_tools-mcp_chromadb_chromadb_get_collection"
        payload = {"name": "vas_vietnam_2025"}

        response = requests.post(url, json=payload, timeout=10)

        if response.status_code == 200:
            result = response.json()
            print(f"✅ Collection: {result.get('name', 'Unknown')}")
            print(f"📄 Document count: {result.get('count', 0)}")
            print(f"🆔 Collection ID: {result.get('id', 'Unknown')}")

            metadata = result.get("metadata", {})
            print(f"📅 Created: {metadata.get('created_at', 'Unknown')}")
            print(f"🌐 Language: {metadata.get('language', 'Unknown')}")
            print(f"📖 Document type: {metadata.get('document_type', 'Unknown')}")
        else:
            print(f"❌ Failed to get collection stats: {response.text}")

    except Exception as e:
        print(f"❌ Error getting collection stats: {e}")


def main():
    """Hàm main"""
    print("🚀 VAS Vietnam ChromaDB Ingestion via MCP Tools")
    print("=" * 60)

    try:
        # Load chunks
        chunks_data = load_vas_chunks()
        total_chunks = len(chunks_data["chunks"])
        print(f"📖 Loaded {total_chunks} chunks from JSON file")

        # Show some stats
        metadata = chunks_data["metadata"]
        print(f"📋 Document: {metadata['document_title']}")
        print(f"🌐 Language: {metadata['language']}")
        print(f"📅 Created: {metadata['created_at']}")

        # Add chunks to ChromaDB
        success_count = add_chunks_via_mcp_tools(chunks_data)

        if success_count > 0:
            # Get collection stats
            get_collection_stats()

            # Test semantic search
            test_semantic_search_comprehensive()

            print("\n" + "=" * 60)
            print("✅ VAS Vietnam ingestion completed!")
            print(f"📊 Successfully ingested: {success_count}/{total_chunks} chunks")
            print(f"🗄️  Collection: vas_vietnam_2025")
            print("🔍 Ready for semantic search on Vietnamese Accounting Standards")

        else:
            print("❌ No chunks were successfully added to ChromaDB")

    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()
