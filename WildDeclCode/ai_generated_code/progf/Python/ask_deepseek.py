# Assisted using common GitHub development utilities
"""
Test client để hỏi đáp với DeepSeek AI qua WebSocket

Kiểm tra xem DeepSeek agent có hoạt động đúng không.
"""

import asyncio
import json
import websockets
from typing import Dict, Any


class DeepSeekTestClient:
    """Client để test DeepSeek agent qua WebSocket."""

    def __init__(self, ws_url: str = "ws://127.0.0.1:8000/ws/chat"):
        self.ws_url = ws_url
        self.websocket = None

    async def connect(self) -> bool:
        """Kết nối đến WebSocket server."""
        try:
            self.websocket = await websockets.connect(self.ws_url)
            print(f"✅ Đã kết nối đến {self.ws_url}")
            return True
        except Exception as e:
            print(f"❌ Lỗi kết nối: {e}")
            return False

    async def send_message(self, message: str, agent: str = "deepseek") -> None:
        """Gửi tin nhắn đến DeepSeek agent."""
        if not self.websocket:
            print("❌ Chưa kết nối WebSocket")
            return

        message_data = {
            "content": message,
            "agent": agent,
            "timestamp": "2025-06-20T15:31:00Z",
        }

        print(f"📤 Gửi tin nhắn: {message}")
        await self.websocket.send(json.dumps(message_data))

    async def receive_response(self) -> Dict[str, Any]:
        """Nhận phản hồi từ server."""
        if not self.websocket:
            print("❌ Chưa kết nối WebSocket")
            return {}

        try:
            response = await asyncio.wait_for(self.websocket.recv(), timeout=30.0)
            data = json.loads(response)
            print(f"📥 Nhận phản hồi: {data.get('type', 'unknown')}")
            return data
        except asyncio.TimeoutError:
            print("⏰ Timeout - không nhận được phản hồi trong 30s")
            return {}
        except Exception as e:
            print(f"❌ Lỗi nhận phản hồi: {e}")
            return {}

    async def chat_session(self, questions: list[str]) -> None:
        """Thực hiện session chat với nhiều câu hỏi."""
        for i, question in enumerate(questions, 1):
            print(f"\n🔹 Câu hỏi {i}: {question}")

            # Gửi câu hỏi
            await self.send_message(question)

            # Chờ phản hồi
            response = await self.receive_response()

            if response:
                if response.get("type") == "response":
                    content = response.get("content", "")
                    agent = response.get("agent", "unknown")
                    model = response.get("model", "unknown")

                    print(f"🤖 Agent: {agent} (Model: {model})")
                    print(f"💬 Phản hồi: {content[:200]}...")

                elif response.get("type") == "error":
                    print(f"❌ Lỗi: {response.get('message', 'Unknown error')}")

                else:
                    print(f"ℹ️ Loại phản hồi khác: {response}")

            # Chờ một chút trước câu hỏi tiếp theo
            if i < len(questions):
                await asyncio.sleep(2)

    async def close(self) -> None:
        """Đóng kết nối WebSocket."""
        if self.websocket:
            await self.websocket.close()
            print("🔌 Đã đóng kết nối WebSocket")


async def test_deepseek_basic() -> None:
    """Test cơ bản với DeepSeek agent."""
    client = DeepSeekTestClient()

    # Danh sách câu hỏi test
    test_questions = [
        "Xin chào! Bạn có thể giới thiệu về bản thân không?",
        "Hãy giải thích khái niệm AI và machine learning bằng tiếng Việt",
        "Viết một đoạn code Python đơn giản để tính fibonacci",
        "Phân tích ưu nhược điểm của DeepSeek V3",
        "Cảm ơn bạn đã trả lời!",
    ]

    try:
        # Kết nối
        if not await client.connect():
            return

        print("🧪 Bắt đầu test DeepSeek agent...")
        print("=" * 50)

        # Thực hiện chat session
        await client.chat_session(test_questions)

        print("=" * 50)
        print("✅ Hoàn thành test DeepSeek agent")

    except KeyboardInterrupt:
        print("\n⚠️ Người dùng dừng test")
    except Exception as e:
        print(f"❌ Lỗi không mong đợi: {e}")
    finally:
        await client.close()


async def test_deepseek_advanced() -> None:
    """Test nâng cao với các loại câu hỏi khác nhau."""
    client = DeepSeekTestClient()

    advanced_questions = [
        "Explain the concept of quantum computing in Vietnamese",
        "Write a Python function to implement binary search with type hints",
        "Compare React vs Vue.js for frontend development",
        "What are the latest trends in AI and machine learning in 2025?",
        "Tôi muốn học lập trình Python, bạn có thể tư vấn lộ trình không?",
    ]

    try:
        if not await client.connect():
            return

        print("🧪 Test nâng cao DeepSeek agent...")
        print("=" * 50)

        await client.chat_session(advanced_questions)

        print("=" * 50)
        print("✅ Hoàn thành test nâng cao")

    except Exception as e:
        print(f"❌ Lỗi: {e}")
    finally:
        await client.close()


def main() -> None:
    """Hàm main để chạy test."""
    print("🔬 DeepSeek Agent Test Client")
    print("Chọn loại test:")
    print("1. Test cơ bản")
    print("2. Test nâng cao")
    print("3. Cả hai")

    choice = input("Nhập lựa chọn (1-3): ").strip()

    if choice == "1":
        asyncio.run(test_deepseek_basic())
    elif choice == "2":
        asyncio.run(test_deepseek_advanced())
    elif choice == "3":

        async def run_both():
            await test_deepseek_basic()
            print("\n" + "=" * 50)
            await test_deepseek_advanced()

        asyncio.run(run_both())
    else:
        print("❌ Lựa chọn không hợp lệ")


if __name__ == "__main__":
    main()
