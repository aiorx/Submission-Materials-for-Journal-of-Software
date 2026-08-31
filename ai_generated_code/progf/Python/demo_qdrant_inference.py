# Assisted using common GitHub development utilities
"""
Demo Qdrant với server có inference service
"""

# Cấu hình Qdrant với inference service
QDRANT_CONFIG = """
service:
  inference:
    hf_service:
      model: "sentence-transformers/all-MiniLM-L6-v2"
      api_key: null  # Hoặc HuggingFace API key nếu cần
"""


# Lưu config vào file
def create_qdrant_config():
    with open("qdrant_config.yaml", "w") as f:
        f.write(QDRANT_CONFIG)
    print("📝 Đã tạo qdrant_config.yaml")
    print("💡 Chạy Docker với config:")
    print(
        "docker run -p 6333:6333 -v $(pwd)/qdrant_config.yaml:/qdrant/config/production.yaml qdrant/qdrant"
    )


if __name__ == "__main__":
    create_qdrant_config()
