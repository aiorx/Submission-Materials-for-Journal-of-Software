# Assisted using common GitHub development utilities
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import os
import shutil
from pathlib import Path

"""
Demo Qdrant với Persistent Storage (lưu file)
"""


def demo_persistent_storage():
    """Demo Qdrant với persistent storage"""
    storage_path = "./qdrant_persistent_data"

    # Xóa thư mục cũ nếu có để demo clean
    if os.path.exists(storage_path):
        shutil.rmtree(storage_path)
        print("🗑️ Đã xóa thư mục cũ: {}".format(storage_path)("💾 Tạo Qdrant client với persistent storage: {}".format(storage_path)lient = QdrantClient(path=storage_path)

    collection_name = "persistent_collection"

    # Tạo collection
    client.create_collection(
        collection_name=collection_name,
        vectors_config=VectorParams(size=4, distance=Distance.COSINE),
    )
    print("📦 Đã tạo collection: {}".format(collection_name)# Thêm dữ liệu
    points = [
        PointStruct(
            id=1, vector=[0.1, 0.2, 0.3, 0.4], payload={"type": "persistent_point_1"}
        ),
        PointStruct(
            id=2, vector=[0.5, 0.6, 0.7, 0.8], payload={"type": "persistent_point_2"}
        ),
        PointStruct(
            id=3, vector=[0.9, 0.8, 0.7, 0.6], payload={"type": "persistent_point_3"}
        ),
    ]

    client.upsert(collection_name=collection_name, points=points)
    print("📤 Đã thêm {} điểm vào collection".format(len(points))iểm tra dữ liệu
    search_result = client.search(
        collection_name=collection_name,
        query_vector=[0.1, 0.2, 0.3, 0.4],
        limit=2,
    )

    print("\n🔍 Kết quả tìm kiếm:")
    for hit in search_result:
        print("  ID: {}, Score: {:.4f}, Payload: {}".format(hit.id, hit.score, hit.payload)")

    # Kiểm tra files đã được tạo
    print("
📁 Kiểm tra files trong {}:".format(storage_path) if os.path.exists(storage_path):
        for root, dirs, files in os.walk(storage_path):
            level = root.replace(storage_path, "").count(os.sep)
            indent = " " * 2 * level
            print("{}{}/".format(indent, os.path.basename(root)))
            subindent = " " * 2 * (level + 1)
            for file in files:
                file_path = os.path.join(root, file)
                file_size = os.path.getsize(file_path)
                print("{}{} ({} bytes)".format(subindent, file, file_size))

    return client, collection_name, storage_path


def demo_load_from_persistent():
    """Demo load dữ liệu từ persistent storage"""
    storage_path = "./qdrant_persistent_data"

    if not os.path.exists(storage_path):
        print("❌ Không tìm thấy persistent data tại: {}".format(storage_path)  return

    print("🔄 Load dữ liệu từ persistent storage: {}".format(storage_path)ent = QdrantClient(path=storage_path)

    collection_name = "persistent_collection"

    # Kiểm tra collections có sẵn
    collections = client.get_collections()
    print("📋 Collections có sẵn: {}".format([c.name for c in collections.collections]) if collection_name not in [c.name for c in collections.collections]:
        print("❌ Collection {} không tồn tại".format(collection_name)   return

    # Lấy tất cả dữ liệu
    all_points = client.scroll(collection_name=collection_name, limit=100)
    print("📊 Tổng số điểm trong collection: {}".format(len(all_points[0])) point in all_points[0]:
        print("  ID: {}, Vector: {}, Payload: {}".format(point.id, point.vector, point.payload))

    # Thử search
    search_result = client.search(
        collection_name=collection_name,
        query_vector=[0.9, 0.8, 0.7, 0.6],
        limit=2,
    )

    print("\n🔍 Kết quả tìm kiếm từ persistent data:")
    for hit in search_result:
        print("  ID: {}, Score: {:.4f}, Payload: {}".format(hit.id, hit.score, hit.payload)")


def run_persistent_demo():
    """Chạy demo persistent storage"""
    print("=" * 60)
    print("🎯 DEMO 1: Tạo và lưu dữ liệu persistent")
    print("=" * 60)

    client, collection_name, storage_path = demo_persistent_storage()

    print("
✅ Dữ liệu đã được lưu vào: {}".format(storage_path) Bạn có thể tắt chương trình và chạy lại để load dữ liệu")

    print("\n" + "=" * 60)
    print("🎯 DEMO 2: Load dữ liệu từ persistent storage")
    print("=" * 60)

    demo_load_from_persistent()

    print("
✅ Demo persistent storage hoàn thành!"if __name__ == "__main__":
    run_persistent_demo()
