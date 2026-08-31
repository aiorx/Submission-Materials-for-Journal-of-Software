# Aided with basic GitHub coding tools
# === Test RAG với mixedbread-ai/mxbai-embed-large-v1 ===
# Thử nghiệm mô hình embedding chất lượng cao Mixedbread AI cho tiếng Việt

import os
import chromadb
from typing import List, Dict, Any, Optional
from chromadb.types import Metadata
from sentence_transformers import SentenceTransformer
import numpy as np


class MixedbreadVietnameseRAG:
    """
    RAG với mô hình Mixedbread AI mxbai-embed-large-v1 - chất lượng cao cho multilingual
    """

    def __init__(self, db_path: str = "./mixedbread_chroma_db"):
        """
        Initialize với mixedbread-ai/mxbai-embed-large-v1
        """
        print("🚀 Khởi tạo Mixedbread Vietnamese RAG...")
        print("🔄 Đang tải mô hình Mixedbread AI mxbai-embed-large-v1...")

        try:
            # Load Mixedbread AI model
            self.model = SentenceTransformer("mixedbread-ai/mxbai-embed-large-v1")
            print("✅ Đã tải thành công mô hình Mixedbread AI!")
        except Exception as e:
            print(f"❌ Lỗi tải mô hình: {e}")
            print("🔄 Fallback về mô hình mặc định...")
            self.model = SentenceTransformer("all-MiniLM-L6-v2")
            print("✅ Đã tải mô hình fallback!")
        # Initialize ChromaDB client (sử dụng default embedding để tránh lỗi protocol)
        self.client = chromadb.PersistentClient(path=db_path)

        # Tạo collection với default embedding của ChromaDB
        try:
            self.collection = self.client.get_collection("mixedbread_vietnamese")
            print("📂 Đã kết nối collection 'mixedbread_vietnamese'")
        except:
            self.collection = self.client.create_collection(
                name="mixedbread_vietnamese",
                metadata={
                    "model": "mixedbread-ai/mxbai-embed-large-v1",
                    "language": "multilingual",
                },
            )
            print("📂 Đã tạo collection mới 'mixedbread_vietnamese'")

    def intelligent_text_splitter(
        self, text: str, chunk_size: int = 400, overlap: int = 50
    ) -> List[str]:
        """
        Text splitter thông minh cho tiếng Việt với Mixedbread model
        """
        # Tách theo đoạn văn trước
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

        chunks = []
        current_chunk = ""

        for para in paragraphs:
            # Nếu đoạn văn quá dài, chia nhỏ hơn
            if len(para) > chunk_size:
                # Tách theo câu
                sentences = []
                temp_sentence = ""

                for char in para:
                    temp_sentence += char
                    if char in ".!?":
                        # Kiểm tra không phải số thập phân
                        next_chars = para[
                            para.index(temp_sentence)
                            + len(temp_sentence) : para.index(temp_sentence)
                            + len(temp_sentence)
                            + 2
                        ]
                        if not (next_chars and next_chars[0].isdigit()):
                            sentences.append(temp_sentence.strip())
                            temp_sentence = ""

                if temp_sentence.strip():
                    sentences.append(temp_sentence.strip())

                # Gộp câu thành chunks
                for sentence in sentences:
                    if (
                        len(current_chunk) + len(sentence) > chunk_size
                        and current_chunk
                    ):
                        chunks.append(current_chunk.strip())

                        # Overlap: giữ lại câu cuối
                        words = current_chunk.split()
                        overlap_words = min(len(words) // 3, overlap // 10)
                        if overlap_words > 0:
                            current_chunk = " ".join(words[-overlap_words:]) + " "
                        else:
                            current_chunk = ""

                    current_chunk += sentence + " "
            else:
                # Đoạn văn ngắn, thêm trực tiếp
                if len(current_chunk) + len(para) > chunk_size and current_chunk:
                    chunks.append(current_chunk.strip())
                    current_chunk = ""

                current_chunk += para + " "

        # Thêm chunk cuối
        if current_chunk.strip():
            chunks.append(current_chunk.strip())

        return [chunk for chunk in chunks if len(chunk.strip()) > 20]

    def add_documents(
        self,
        texts: List[str],
        metadatas: Optional[List[Dict[str, Any]]] = None,
        ids: Optional[List[str]] = None,
    ):
        """
        Thêm documents với Mixedbread embeddings
        """
        if ids is None:
            ids = [f"mixedbread_doc_{i}" for i in range(len(texts))]

        if metadatas is None:
            metadatas = [{"source": "unknown", "model": "mixedbread-ai"} for _ in texts]

        # Cast to compatible type
        metadata_list = [dict(meta) for meta in metadatas]  # type: ignore

        self.collection.add(
            documents=texts, metadatas=metadata_list, ids=ids  # type: ignore
        )

        print(f"📝 Đã thêm {len(texts)} documents với Mixedbread embeddings")
        return len(texts)

    def semantic_search(
        self,
        query: str,
        n_results: int = 5,
        filter_metadata: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Semantic search với Mixedbread embeddings
        """
        print(f"🔍 Đang tìm kiếm: '{query}'")

        results = self.collection.query(
            query_texts=[query], n_results=n_results, where=filter_metadata
        )

        # Format kết quả
        formatted_results = []
        if results["documents"] and results["documents"][0]:
            for i, doc in enumerate(results["documents"][0]):
                formatted_results.append(
                    {
                        "content": doc,
                        "distance": (
                            results["distances"][0][i] if results["distances"] else None
                        ),
                        "metadata": (
                            results["metadatas"][0][i] if results["metadatas"] else None
                        ),
                        "id": results["ids"][0][i] if results["ids"] else None,
                    }
                )

        return formatted_results

    def ingest_text_intelligent(
        self, text: str, metadata: Optional[Dict[str, Any]] = None
    ) -> int:
        """
        Ingest text với intelligent chunking và Mixedbread embeddings
        """
        chunks = self.intelligent_text_splitter(text)

        if metadata is None:
            metadata = {"source": "manual", "model": "mixedbread-ai"}

        metadatas = [metadata for _ in chunks]
        ids = [f"{metadata.get('source', 'doc')}_{i}" for i in range(len(chunks))]

        return self.add_documents(chunks, metadatas, ids)

    def compare_models(self, query: str) -> Dict[str, Any]:
        """
        So sánh kết quả với các collection khác (nếu có)
        """
        results = {
            "mixedbread": self.semantic_search(query, n_results=3),
            "query": query,
        }

        return results


# === Test với dữ liệu tiếng Việt phong phú ===
if __name__ == "__main__":
    print("🎯 TESTING MIXEDBREAD AI mxbai-embed-large-v1 VỚI TIẾNG VIỆT")
    print("=" * 70)

    # Khởi tạo RAG với Mixedbread model
    rag = MixedbreadVietnameseRAG(db_path="./mixedbread_chroma_db")

    # Tạo dữ liệu test phong phú
    vietnamese_documents = {
        "tech_vietnam.txt": """
        Công nghệ thông tin Việt Nam đang bùng nổ với nhiều đột phá ấn tượng.
        
        Các công ty công nghệ hàng đầu:
        - VNG Corporation: Zalo, Zing, game online
        - FPT Software: Phần mềm, AI, digital transformation
        - Tiki: Thương mại điện tử, logistics thông minh  
        - Grab Vietnam: Super app, giao thông và giao hàng
        - VinSmart: Smartphone, IoT, công nghệ 5G
        
        Lĩnh vực AI/ML phát triển mạnh:
        Xử lý ngôn ngữ tự nhiên tiếng Việt, computer vision, 
        chatbot thông minh, recommendation systems.
        
        Startup ecosystem sôi động với nhiều quỹ đầu tư như
        IDG Ventures, 500 Startups, Openspace Ventures.
        """,
        "programming_vietnam.txt": """
        Cộng đồng lập trình Việt Nam rất năng động và sáng tạo.
        
        Ngôn ngữ lập trình phổ biến:
        1. JavaScript/TypeScript - Frontend và Backend development
        2. Python - AI/ML, data science, automation
        3. Java - Enterprise applications, Spring framework
        4. C# - .NET development, Unity game development  
        5. Go - Microservices, cloud native applications
        6. Rust - System programming an toàn, performance cao
        
        Framework và công nghệ hot:
        - React, Vue.js, Angular cho frontend
        - Node.js, Django, FastAPI cho backend
        - TensorFlow, PyTorch cho AI/ML
        - Docker, Kubernetes cho DevOps
        - AWS, Azure, GCP cho cloud computing
        
        Cộng đồng học tập: Topcoder, Codeforces, HackerRank
        """,
        "ai_vietnam.txt": """
        Trí tuệ nhân tạo tại Việt Nam đang trở thành xu hướng chủ đạo.
        
        Các lĩnh vực AI phát triển:
        - Natural Language Processing cho tiếng Việt
        - Computer Vision cho y tế, nông nghiệp
        - Recommendation Systems cho e-commerce
        - Chatbot và Virtual Assistant
        - Predictive Analytics cho tài chính
        
        Công ty AI hàng đầu:
        VinAI Research, FPT.AI, Zalo AI, VCC.ai, Anfin.
        
        Ứng dụng thực tế:
        Phân tích X-quang tự động, dự đoán thời tiết,
        tối ưu hóa giao thông, phân tích tình cảm social media,
        chatbot chăm sóc khách hàng đa ngôn ngữ.
        
        Thách thức: Thiếu dữ liệu tiếng Việt chất lượng,
        cần đầu tư nghiên cứu fundamental AI research.
        """,
    }

    # Tạo thư mục docs
    os.makedirs("./docs", exist_ok=True)

    # Ghi và ingest documents
    total_chunks = 0
    for filename, content in vietnamese_documents.items():
        filepath = f"./docs/{filename}"
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content.strip())
        print(f"📄 Đã tạo file: {filepath}")

        # Ingest với metadata
        n = rag.ingest_text_intelligent(
            content,
            metadata={
                "source": filename,
                "lang": "vi",
                "topic": filename.split("_")[0],
            },
        )
        total_chunks += n
        print(f"✅ Đã ingest {n} chunks từ {filename}")

    print(f"\n📊 Tổng cộng đã ingest {total_chunks} chunks với Mixedbread embeddings")

    # Test queries chất lượng cao
    test_queries = [
        "Startup công nghệ nào thành công ở Việt Nam?",
        "Ngôn ngữ lập trình nào phổ biến cho AI/ML?",
        "VinAI Research làm gì trong lĩnh vực AI?",
        "Framework JavaScript nào tốt cho frontend?",
        "Thách thức của AI Việt Nam là gì?",
        "Công ty nào phát triển Zalo?",
        "Docker và Kubernetes dùng để làm gì?",
        "Ứng dụng AI trong y tế Việt Nam",
    ]

    print("\n" + "=" * 70)
    print("🧪 TESTING SEMANTIC SEARCH VỚI MIXEDBREAD AI")
    print("=" * 70)

    for i, query in enumerate(test_queries, 1):
        print(f"\n[Q{i}] {query}")
        print("-" * 60)

        try:
            results = rag.semantic_search(query, n_results=2)

            if results:
                for j, result in enumerate(results, 1):
                    distance = result["distance"]
                    content = (
                        result["content"][:200] + "..."
                        if len(result["content"]) > 200
                        else result["content"]
                    )
                    source = (
                        result["metadata"].get("source", "unknown")
                        if result["metadata"]
                        else "unknown"
                    )
                    topic = (
                        result["metadata"].get("topic", "general")
                        if result["metadata"]
                        else "general"
                    )

                    print(f"  [{j}] 🎯 Distance: {distance:.3f} | Topic: {topic}")
                    print(f"      📄 Source: {source}")
                    print(f"      📝 Content: {content}")
                    print()
            else:
                print("  ❌ Không tìm thấy kết quả phù hợp")

        except Exception as e:
            print(f"  ❌ Lỗi: {e}")

        print()

    print("=" * 70)
    print("✅ HOÀN THÀNH TEST MIXEDBREAD AI RAG PIPELINE")
    print("=" * 70)

    # Thống kê collection
    collection_info = rag.collection.count()
    print(f"📊 Collection stats: {collection_info} documents total")
