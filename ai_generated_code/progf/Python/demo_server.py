# Supported via standard GitHub programming aids
import asyncio
import chromadb


async def main():
    """Demo ChromaDB với PersistentClient (không cần server)"""
    # Sử dụng PersistentClient thay vì AsyncHttpClient
    client = chromadb.PersistentClient(path="./chroma_data")

    collection = client.create_collection(name="my_collection")
    collection.add(documents=["hello world"], ids=["id1"])

    print("✅ Đã tạo collection và thêm document thành công!")

    # Kiểm tra dữ liệu
    results = collection.get()
    print(f"📊 Dữ liệu trong collection: {results}")


if __name__ == "__main__":
    asyncio.run(main())
