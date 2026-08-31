# Aided with basic GitHub coding tools
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from qdrant_client.http.exceptions import ResponseHandlingException

"""
Demo Qdrant với error handling

CÁCH 1: Chạy Qdrant server với Docker:
docker run -p 6333:6333 qdrant/qdrant

CÁCH 2: Sử dụng in-memory client (không cần server)
"""


def demo_with_server():
    """Demo với Qdrant server"""
    try:
        # Kết nối đến Qdrant server
        client = QdrantClient("localhost", port=6333)

        # Test connection
        client.get_collections()
        print("✅ Kết nối Qdrant server thành công!")

        collection_name = "demo_collection"

        # Kiểm tra và tạo collection (cách mới, không deprecated)
        if client.collection_exists(collection_name):
            client.delete_collection(collection_name)
            print(f"🗑️ Đã xóa collection cũ: {collection_name}")

        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=4, distance=Distance.COSINE),
        )
        print(f"📦 Đã tạo collection: {collection_name}")

        return client, collection_name

    except ResponseHandlingException as e:
        print(f"❌ Không thể kết nối Qdrant server: {e}")
        print("💡 Hãy chạy: docker run -p 6333:6333 qdrant/qdrant")
        return None, None


def demo_in_memory():
    """Demo với in-memory client (không cần server)"""
    print("🧠 Sử dụng Qdrant in-memory mode...")
    client = QdrantClient(":memory:")

    collection_name = "demo_collection"

    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=4, distance=Distance.COSINE),
    )
    print(f"📦 Đã tạo in-memory collection: {collection_name}")

    return client, collection_name


def run_demo():
    """Chạy demo với fallback"""
    # Thử kết nối server trước
    client, collection_name = demo_with_server()

    # Nếu không có server, dùng in-memory
    if client is None:
        client, collection_name = demo_in_memory()

    # Kiểm tra client và collection_name không None
    if client is None or collection_name is None:
        print("❌ Không thể khởi tạo Qdrant client")
        return

    # Dữ liệu demo
    points = [
        PointStruct(id=1, vector=[0.1, 0.2, 0.3, 0.4], payload={"name": "point 1"}),
        PointStruct(id=2, vector=[0.2, 0.1, 0.4, 0.3], payload={"name": "point 2"}),
        PointStruct(id=3, vector=[0.9, 0.8, 0.7, 0.6], payload={"name": "point 3"}),
    ]

    # Thêm dữ liệu vào Qdrant
    client.upsert(collection_name=collection_name, points=points)
    print(f"📤 Đã thêm {len(points)} điểm vào collection")

    # Vector query: tìm điểm gần nhất
    query_vector = [0.1, 0.2, 0.3, 0.39]
    search_result = client.search(
        collection_name=collection_name,
        query_vector=query_vector,
        limit=2,  # lấy 2 điểm gần nhất
    )

    print("\n🔍 Kết quả tìm kiếm:")
    for hit in search_result:
        print(f"  ID: {hit.id}, Score: {hit.score:.4f}, Payload: {hit.payload}")

    print(f"\n✅ Demo Qdrant hoàn thành thành công!")


if __name__ == "__main__":
    run_demo()
