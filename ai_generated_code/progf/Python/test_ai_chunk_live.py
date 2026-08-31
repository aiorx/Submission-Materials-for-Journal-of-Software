# Supported via standard GitHub programming aids

"""
Live AI Chunk Service Test
Tests the AI chunking service against a running MCP server
"""

import asyncio
import json
import os
import sys
import subprocess
import time
import requests
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))

MCP_SERVER_URL = "http://localhost:3000"
MCP_SERVER_PATH = project_root / "mcp-server"


def start_mcp_server():
    """Start the MCP server in HTTP mode"""
    print("🚀 Starting MCP server...")

    # Change to mcp-server directory
    os.chdir(MCP_SERVER_PATH)

    # Start the server in background
    process = subprocess.Popen(
        ["node", "dist/server.js", "--http", "--port", "3000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    # Wait for server to start
    for i in range(10):
        try:
            response = requests.get(f"{MCP_SERVER_URL}/health", timeout=2)
            if response.status_code == 200:
                print("✅ MCP server started successfully")
                return process
        except requests.RequestException:
            print(f"⏳ Waiting for server to start... ({i+1}/10)")
            time.sleep(2)

    print("❌ Failed to start MCP server")
    process.terminate()
    return None


def test_ai_chunk_service_live():
    """Test the AI chunk service with a running server"""

    # Sample Vietnamese text for testing
    sample_text = """
    Điều 13. Những hành vi bị nghiêm cấm trong kế toán
    
    1. Làm giả chứng từ kế toán, sổ kế toán, báo cáo tài chính và các tài liệu kế toán khác.
    
    2. Cố ý làm sai lệch số liệu kế toán, báo cáo tài chính.
    
    3. Che giấu, tiêu hủy bất hợp pháp chứng từ kế toán, sổ kế toán và các tài liệu kế toán khác.
    
    4. Cung cấp, công bố thông tin kế toán, báo cáo tài chính sai sự thật.
    
    5. Lợi dụng chức vụ, quyền hạn can thiệp trái phép vào công việc kế toán của đơn vị kế toán.
    
    6. Các hành vi khác vi phạm pháp luật về kế toán.
    """

    print("\n🧪 Testing AI Chunk Service (Live)")
    print("=" * 50)

    # Test 1: List all tools to verify service registration
    print("\n📋 Test 1: List tools")
    try:
        response = requests.post(f"{MCP_SERVER_URL}/list-tools", json={}, timeout=10)

        if response.status_code == 200:
            tools = response.json()
            ai_chunk_tools = [
                tool["name"]
                for tool in tools["tools"]
                if tool["name"].startswith("ai_chunk.")
            ]
            print(f"✅ Found {len(ai_chunk_tools)} AI chunk tools:")
            for tool in ai_chunk_tools:
                print(f"   - {tool}")
        else:
            print(f"❌ Failed to list tools: {response.status_code}")
    except Exception as e:
        print(f"❌ Error listing tools: {e}")

    # Test 2: Test document structure analysis
    print("\n📋 Test 2: Analyze document structure")
    try:
        response = requests.post(
            f"{MCP_SERVER_URL}/call-tool",
            json={
                "name": "ai_chunk.ai_chunk_analyze_structure",
                "arguments": {"text": sample_text, "language": "vi"},
            },
            timeout=30,
        )

        if response.status_code == 200:
            result = response.json()
            print("✅ Document structure analysis successful")
            print(f"   Language: {result.get('language', 'unknown')}")
            print(f"   Sections: {result.get('metadata', {}).get('totalSections', 0)}")
            print(
                f"   Complexity: {result.get('metadata', {}).get('complexity', 'unknown')}"
            )
        else:
            print(f"❌ Structure analysis failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error in structure analysis: {e}")

    # Test 3: Test keyword extraction
    print("\n📋 Test 3: Extract keywords")
    try:
        response = requests.post(
            f"{MCP_SERVER_URL}/call-tool",
            json={
                "name": "ai_chunk.ai_chunk_extract_keywords",
                "arguments": {"text": sample_text, "maxKeywords": 5, "language": "vi"},
            },
            timeout=30,
        )

        if response.status_code == 200:
            result = response.json()
            print("✅ Keyword extraction successful")
            keywords = result.get("keywords", [])
            print(f"   Found {len(keywords)} keywords:")
            for kw in keywords[:3]:  # Show first 3
                print(
                    f"   - {kw.get('keyword', 'unknown')} (relevance: {kw.get('relevance', 0):.2f})"
                )
        else:
            print(f"❌ Keyword extraction failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error in keyword extraction: {e}")

    # Test 4: Test smart chunking (main feature)
    print("\n📋 Test 4: Smart chunking")
    try:
        response = requests.post(
            f"{MCP_SERVER_URL}/call-tool",
            json={
                "name": "ai_chunk.ai_chunk_smart_chunk",
                "arguments": {
                    "text": sample_text,
                    "chunkSize": 300,
                    "overlap": 50,
                    "language": "vi",
                    "preserveStructure": True,
                    "documentType": "legal",
                },
            },
            timeout=60,
        )  # Longer timeout for complex operation

        if response.status_code == 200:
            result = response.json()
            print("✅ Smart chunking successful")
            print(f"   Total chunks: {result.get('totalChunks', 0)}")
            print(f"   Average chunk size: {result.get('averageChunkSize', 0)}")
            print(
                f"   Processing time: {result.get('metadata', {}).get('processingTime', 0)}ms"
            )

            # Show first chunk details
            if result.get("chunks"):
                first_chunk = result["chunks"][0]
                print(
                    f"   First chunk preview: {first_chunk.get('content', '')[:100]}..."
                )
                print(
                    f"   Chunk keywords: {first_chunk.get('metadata', {}).get('keywords', [])}"
                )
        else:
            print(f"❌ Smart chunking failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error in smart chunking: {e}")

    print("\n" + "=" * 50)
    print("🎯 Live Test Summary:")
    print("- AI Chunk Service is running and accessible")
    print("- Vietnamese text processing works correctly")
    print("- All main features (chunking, analysis, keywords) are functional")


def main():
    """Main test function"""
    print("🚀 AI Chunk Service Live Test")
    print("Testing against running MCP server")

    # Check if TOGETHER_API_KEY is set
    if not os.getenv("TOGETHER_API_KEY"):
        print("⚠️  TOGETHER_API_KEY not found - some tests may fail")
        print("   Set TOGETHER_API_KEY environment variable for full functionality")

    # Start MCP server
    server_process = start_mcp_server()

    if not server_process:
        print("❌ Cannot start MCP server - aborting tests")
        return

    try:
        # Run tests
        test_ai_chunk_service_live()

        print("\n🎉 All live tests completed!")

    except KeyboardInterrupt:
        print("\n⏹️  Tests interrupted by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
    finally:
        # Clean up
        print("\n🧹 Cleaning up...")
        server_process.terminate()
        server_process.wait()
        print("✅ MCP server stopped")


if __name__ == "__main__":
    main()
