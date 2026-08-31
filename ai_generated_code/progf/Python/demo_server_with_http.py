# Assisted using common GitHub development utilities
"""
Demo ChromaDB với HTTP Server
Cần chạy ChromaDB server trước:
uv run chroma run --host localhost --port 8000
"""
import asyncio
import chromadb


async def main():
    """Demo ChromaDB với AsyncHttpClient (cần server)"""
    try:
        # Kết nối tới ChromaDB server
        client = await chromadb.AsyncHttpClient(host="localhost", port=8000)

        # Tạo collection
        collection = await client.create_collection(name="my_http_collection")
        await collection.add(documents=["hello world from HTTP"], ids=["http_id1"])

        print("✅ Đã tạo collection và thêm document thành công qua HTTP!")

        # Kiểm tra dữ liệu
        results = await collection.get()
        print(f"📊 Dữ liệu trong collection: {results}")

    except Exception as e:
        print(f"❌ Lỗi kết nối ChromaDB server: {e}")
        print("💡 Hãy chạy: uv run chroma run --host localhost --port 8000")


if __name__ == "__main__":
    asyncio.run(main())
