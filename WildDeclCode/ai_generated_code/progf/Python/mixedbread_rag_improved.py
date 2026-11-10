# Aided with basic GitHub coding tools
# === RAG Pipeline cải thiện với mixedbread-ai/mxbai-embed-large-v1 ===
# Thử nghiệm mô hình embedding chất lượng cao Mixedbread AI cho tiếng Việt

import os
import chromadb
from typing import List, Dict, Any, Optional
from chromadb.types import Metadata
from sentence_transformers import SentenceTransformer
import numpy as np


def setup_huggingface_token():
    """
    Setup Hugging Face token từ nhiều nguồn khác nhau
    """
    # Thử nhiều cách để lấy HF_TOKEN
    token_sources = [
        os.getenv("HF_TOKEN"),
        os.getenv("HUGGINGFACE_TOKEN"),
        os.getenv("HF_TOKEN", ""),  # fallback empty
    ]

    # Thử đọc từ file .env nếu có
    try:
        if os.path.exists(".env"):
            with open(".env", "r") as f:
                for line in f:
                    if line.strip().startswith("HF_TOKEN="):
                        token_sources.append(line.strip().split("=", 1)[1])
    except:
        pass

    # Thử đọc từ file token.txt nếu có
    try:
        if os.path.exists("token.txt"):
            with open("token.txt", "r") as f:
                token_sources.append(f.read().strip())
    except:
        pass

    # Tìm token đầu tiên không rỗng
    for token in token_sources:
        if token and token.strip() and not token.startswith("hf_example"):
            print(f"✅ Tìm thấy HF_TOKEN: {token[:10]}...")
            # Set vào environment để sentence-transformers sử dụng
            os.environ["HF_TOKEN"] = token.strip()
            os.environ["HUGGINGFACE_HUB_TOKEN"] = token.strip()
            return token.strip()

    print("❌ Không tìm thấy HF_TOKEN hợp lệ")
    return None


class MixedbreadVietnameseRAG:
    """
    RAG với mô hình Mixedbread AI mxbai-embed-large-v1 - chất lượng cao cho multilingual
    """

    def __init__(self, db_path: str = "./mixedbread_chroma_db"):
        """
        Initialize với mixedbread-ai/mxbai-embed-large-v1
        """
        print("🚀 Khởi tạo Mixedbread Vietnamese RAG...")

        # Setup HF_TOKEN trước khi tải model
        token = setup_huggingface_token()
        if not token:
            print("⚠️ Không có HF_TOKEN - một số model có thể không tải được")

        print("🔄 Đang tải mô hình Mixedbread AI mxbai-embed-large-v1...")

        try:
            # Thử load Mixedbread AI model trước
            print("🔄 Đang thử tải mô hình Mixedbread AI...")
            self.model = SentenceTransformer("mixedbread-ai/mxbai-embed-large-v1")
            self.model_name = "mixedbread-ai/mxbai-embed-large-v1"
            print("✅ Đã tải thành công mô hình Mixedbread AI!")
        except Exception as e:
            print(f"❌ Lỗi tải Mixedbread model: {e}")
            print("🔄 Thử các mô hình thay thế...")

            # List các models thay thế không cần auth
            alternative_models = [
                "sentence-transformers/paraphrase-multilingual-mpnet-base-v2",
                "sentence-transformers/distiluse-base-multilingual-cased",
                "sentence-transformers/all-MiniLM-L12-v2",
                "sentence-transformers/all-mpnet-base-v2",
            ]

            self.model = None
            self.model_name = "chromadb-default"

            for model_name in alternative_models:
                try:
                    print(f"🔄 Đang thử tải: {model_name}")
                    self.model = SentenceTransformer(model_name)
                    self.model_name = model_name
                    print(f"✅ Đã tải thành công: {model_name}")
                    break
                except Exception as e2:
                    print(f"❌ Lỗi {model_name}: {e2}")
                    continue

            if not self.model:
                print("❌ Không thể tải bất kỳ sentence-transformers model nào")
                print("🔄 Sử dụng ChromaDB default embedding...")
                self.model = None
                self.model_name = "chromadb-default"

        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(path=db_path)

        # Tạo collection
        try:
            self.collection = self.client.get_collection("mixedbread_vietnamese")
            print("📂 Đã kết nối collection 'mixedbread_vietnamese'")
        except:
            self.collection = self.client.create_collection(
                name="mixedbread_vietnamese",
                metadata={
                    "model": self.model_name,
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
        paragraphs = [p.strip() for p in text.split("\\n\\n") if p.strip()]

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
                            + 3
                        ]
                        if not any(c.isdigit() for c in next_chars):
                            sentences.append(temp_sentence.strip())
                            temp_sentence = ""

                # Thêm câu cuối
                if temp_sentence.strip():
                    sentences.append(temp_sentence.strip())

                # Combine sentences to chunks
                for sentence in sentences:
                    if len(current_chunk) + len(sentence) <= chunk_size:
                        current_chunk += " " + sentence
                    else:
                        if current_chunk.strip():
                            chunks.append(current_chunk.strip())
                        current_chunk = sentence
            else:
                # Đoạn văn ngắn, thêm trực tiếp
                if len(current_chunk) + len(para) <= chunk_size:
                    current_chunk += "\\n" + para
                else:
                    if current_chunk.strip():
                        chunks.append(current_chunk.strip())
                    current_chunk = para

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
        🔥 Thêm documents với custom embeddings (FIX chính)
        """
        if ids is None:
            ids = [f"mixedbread_doc_{i}" for i in range(len(texts))]

        if metadatas is None:
            metadatas = [{"source": "unknown", "model": self.model_name} for _ in texts]

        # Cast to compatible type for ChromaDB
        metadata_list: List[Metadata] = []
        for meta in metadatas:
            # Ensure all values are of correct types for ChromaDB Metadata
            clean_meta: Metadata = {}
            for k, v in meta.items():
                if isinstance(v, (str, int, float, bool)) or v is None:
                    clean_meta[k] = v
                else:
                    clean_meta[k] = str(v)  # Convert to string if not basic type
            metadata_list.append(clean_meta)

        # 🔥 Tạo embeddings với model đã load (thay vì để ChromaDB tự tạo)
        if self.model:
            print(f"🧠 Tạo embeddings với {self.model_name}...")
            embeddings = self.model.encode(texts, normalize_embeddings=True)
            # Convert numpy array to list for ChromaDB
            embeddings_list = embeddings.tolist()

            self.collection.add(
                documents=texts,
                metadatas=metadata_list,
                ids=ids,
                embeddings=embeddings_list,  # 🎯 Sử dụng custom embeddings
            )
            print(f"📝 Đã thêm {len(texts)} documents với {self.model_name} embeddings")
        else:
            # Fallback: ChromaDB default embedding
            self.collection.add(documents=texts, metadatas=metadata_list, ids=ids)
            print(f"📝 Đã thêm {len(texts)} documents với ChromaDB default embeddings")

        return len(texts)

    def semantic_search(
        self,
        query: str,
        n_results: int = 5,
        filter_metadata: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        🔥 Semantic search với custom query embeddings (FIX chính)
        """
        print(f"🔍 Đang tìm kiếm: '{query}'")

        # 🔥 Tạo query embedding với model đã load
        if self.model:
            print(f"🧠 Tạo query embedding với {self.model_name}...")
            query_embedding = self.model.encode([query], normalize_embeddings=True)
            query_embedding_list = query_embedding.tolist()

            results = self.collection.query(
                query_embeddings=query_embedding_list,  # 🎯 Sử dụng custom query embedding
                n_results=n_results,
                where=filter_metadata,
            )
        else:
            # Fallback: ChromaDB default
            results = self.collection.query(
                query_texts=[query], n_results=n_results, where=filter_metadata
            )  # Format kết quả đẹp
        formatted_results = []
        if results and results["documents"] and results["documents"][0]:
            for i in range(len(results["documents"][0])):
                result = {
                    "content": results["documents"][0][i],
                    "metadata": (
                        results["metadatas"][0][i]
                        if results["metadatas"] and results["metadatas"][0]
                        else {}
                    ),
                    "distance": (
                        results["distances"][0][i]
                        if results["distances"] and results["distances"][0]
                        else 1.0
                    ),
                    "id": (
                        results["ids"][0][i]
                        if results["ids"] and results["ids"][0]
                        else f"doc_{i}"
                    ),
                }
                formatted_results.append(result)

        return formatted_results

    def ingest_file(self, file_path: str, topic: str = "general") -> int:
        """
        Đọc file và chunk thành documents
        """
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            chunks = self.intelligent_text_splitter(content)
            metadatas = [
                {
                    "source": os.path.basename(file_path),
                    "topic": topic,
                    "model": self.model_name,
                }
                for _ in chunks
            ]
            ids = [f"{topic}_{i}" for i in range(len(chunks))]

            return self.add_documents(chunks, metadatas, ids)
        except Exception as e:
            print(f"❌ Lỗi đọc file {file_path}: {e}")
            return 0

    def compare_embeddings(self, text: str) -> Dict[str, Any]:
        """
        So sánh chất lượng embedding giữa các models
        """
        if not self.model:
            return {"error": "Không có model để so sánh"}

        embedding = self.model.encode([text], normalize_embeddings=True)

        return {
            "model": self.model_name,
            "text": text[:100] + "..." if len(text) > 100 else text,
            "embedding_dim": len(embedding[0]),
            "embedding_norm": float(np.linalg.norm(embedding[0])),
            "sample_values": embedding[0][:5].tolist(),  # 5 giá trị đầu
        }

    def get_collection_stats(self) -> Dict[str, Any]:
        """
        Thống kê collection
        """
        try:
            collection_data = self.collection.get()
            docs_count = (
                len(collection_data["documents"]) if collection_data["documents"] else 0
            )
            return {
                "total_documents": docs_count,
                "model_used": self.model_name,
                "collection_name": self.collection.name,
                "sample_metadata": (
                    collection_data["metadatas"][:3]
                    if collection_data["metadatas"]
                    else []
                ),
            }
        except Exception as e:
            return {"error": f"Lỗi lấy stats: {e}"}


def create_test_documents():
    """
    Tạo tài liệu test tiếng Việt (tách riêng khỏi class)
    """
    os.makedirs("./docs", exist_ok=True)

    # Tech Vietnam
    tech_content = """Công nghệ thông tin Việt Nam đang bùng nổ với nhiều đột phá ấn tượng. Các công ty công nghệ hàng đầu:
        - VNG Corporation: Zalo, Zing, game online
        - FPT Software: Phần mềm, AI, digital transformation  
        - Tiki: Thương mại điện tử
        - Shopee Việt Nam: E-commerce platform
        
Các startup unicorn:
        - VNPay: Fintech, thanh toán điện tử
        - VinFast: Xe điện thông minh
        - Be Group: Ride-hailing, logistics
        
Xu hướng công nghệ hot:
        - AI/Machine Learning cho tiếng Việt
        - Blockchain và Web3
        - IoT cho smart city
        - Cloud computing với AWS, Azure
        - DevOps và microservices architecture"""

    with open("./docs/tech_vietnam.txt", "w", encoding="utf-8") as f:
        f.write(tech_content)
    print("📄 Đã tạo file: ./docs/tech_vietnam.txt")

    # Programming Vietnam
    programming_content = """Cộng đồng lập trình Việt Nam rất năng động và sáng tạo. Ngôn ngữ lập trình phổ biến:
        1. JavaScript/TypeScript - Frontend và Backend development
        2. Python - AI/ML, data science, automation
        3. Java - Enterprise applications, Android
        4. C# - .NET ecosystem, game development
        5. Go - Microservices, system programming
        6. Rust - System programming, performance critical
        
Framework và công cụ:
        - React, Vue.js, Angular cho frontend
        - Node.js, Django, FastAPI cho backend
        - TensorFlow, PyTorch cho AI/ML
        - Docker, Kubernetes cho DevOps
        - AWS, Azure, GCP cho cloud computing
        
Coding bootcamp nổi tiếng:
        - Techmaster: Full-stack development
        - CodeGym: Java programming
        - MindX: AI và Data Science
        - FUNiX: Đào tạo lập trình online"""

    with open("./docs/programming_vietnam.txt", "w", encoding="utf-8") as f:
        f.write(programming_content)
    print("📄 Đã tạo file: ./docs/programming_vietnam.txt")

    # AI Vietnam
    ai_content = """Trí tuệ nhân tạo tại Việt Nam đang trở thành xu hướng chủ đạo. Các lĩnh vực AI phát triển:
        - Natural Language Processing cho tiếng Việt
        - Computer Vision cho y tế, nông nghiệp
        - Recommendation systems cho e-commerce
        - Fraud detection cho fintech
        - Chatbot và virtual assistant
        
Các tổ chức nghiên cứu AI hàng đầu: VinAI Research, FPT.AI, Zalo AI, VCC.ai, Anfin. Ứng dụng thực tế:
        Phân tích X-quang tự động, dự đoán thời tiết,
        tối ưu hóa giao thông, phân tích tình cảm social media,
        recommendation engine cho shopping, fraud detection banking."""

    with open("./docs/ai_vietnam.txt", "w", encoding="utf-8") as f:
        f.write(ai_content)
    print("📄 Đã tạo file: ./docs/ai_vietnam.txt")


def run_test():
    """
    🔥 Chạy test RAG pipeline (tách riêng)
    """
    print("🎯 TESTING MIXEDBREAD AI mxbai-embed-large-v1 VỚI TIẾNG VIỆT")
    print("=" * 70)

    # Initialize RAG
    rag = MixedbreadVietnameseRAG()

    # Tạo test documents
    create_test_documents()

    # Ingest documents
    total_chunks = 0
    for file_name, topic in [
        ("tech_vietnam.txt", "tech"),
        ("programming_vietnam.txt", "programming"),
        ("ai_vietnam.txt", "ai"),
    ]:
        chunks = rag.ingest_file(f"./docs/{file_name}", topic)
        total_chunks += chunks
        print(f"✅ Đã ingest {chunks} chunks từ {file_name}")

    print(
        f"📊 Tổng cộng đã ingest {total_chunks} chunks với {rag.model_name} embeddings"
    )

    # Test queries
    print("=" * 70)
    print("🧪 TESTING SEMANTIC SEARCH VỚI MIXEDBREAD AI")
    print("=" * 70)

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

    for i, query in enumerate(test_queries, 1):
        print(f"[Q{i}] {query}")
        print("-" * 60)

        results = rag.semantic_search(query, n_results=2)
        for j, result in enumerate(results, 1):
            topic = result["metadata"].get("topic", "unknown")
            source = result["metadata"].get("source", "unknown")
            content = (
                result["content"][:150] + "..."
                if len(result["content"]) > 150
                else result["content"]
            )

            print(f"  [{j}] 🎯 Distance: {result['distance']:.3f} | Topic: {topic}")
            print(f"      📄 Source: {source}")
            print(f"      📝 Content: {content}")

    # Stats
    print("=" * 70)
    print("✅ HOÀN THÀNH TEST MIXEDBREAD AI RAG PIPELINE")
    print("=" * 70)
    stats = rag.get_collection_stats()
    print(f"📊 Collection stats: {stats['total_documents']} documents total")

    # Compare embeddings
    if rag.model:
        print("\\n🔍 So sánh chất lượng embedding:")
        comparison = rag.compare_embeddings("Công nghệ AI Việt Nam phát triển mạnh")
        print(f"Model: {comparison['model']}")
        print(f"Embedding dimension: {comparison['embedding_dim']}")
        print(f"Norm: {comparison['embedding_norm']:.4f}")


if __name__ == "__main__":
    run_test()
