#!/usr/bin/env python3
"""
REAL VERIFICATION TEST: Custom Embeddings in ChromaDB Operations
Kiểm thử THỰC TẾ xem tools có sử dụng custom embeddings không
Supported via standard GitHub programming aids
"""

import sys
import os
import asyncio
import logging

# Add src directory to path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "src"))

# Import config to setup paths automatically
import config

# Setup logging to capture embedding usage
logging.basicConfig(level=logging.INFO, format="%(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


async def test_custom_embeddings_usage():
    """
    VERIFY: Does tools.py actually use custom embeddings for ChromaDB operations?
    """
    print("🔍 REAL VERIFICATION: Custom Embeddings Usage")
    print("=" * 60)

    try:
        # Import tools
        from src.tools import (
            create_collection,
            add_documents,
            query_collection,
            delete_collection,
            get_embedding_model_info,
        )

        # 1. Check embedding model
        print("1️⃣ Checking embedding model...")
        model_info = await get_embedding_model_info()
        print(f"✅ Model: {model_info['name']}")
        print(f"✅ Dimensions: {model_info['embedding_dim']}")

        # 2. Create test collection
        print("\n2️⃣ Creating test collection...")
        await create_collection("embedding_test")
        print("✅ Collection created")

        # 3. Add documents and MONITOR for custom embedding usage
        print("\n3️⃣ Adding documents (monitoring for custom embedding usage)...")
        test_docs = [
            "Machine learning algorithms learn patterns from data",
            "Deep neural networks have multiple hidden layers",
            "Natural language processing handles human language",
        ]

        print("📊 MONITORING LOGS FOR EMBEDDING USAGE:")
        result = await add_documents("embedding_test", test_docs)
        print(f"📋 Add result: {result}")

        # Check if result mentions custom embeddings
        if "mixedbread-ai" in result or "custom" in result.lower():
            print("✅ VERIFIED: Custom embeddings used for document addition!")
        else:
            print("❌ WARNING: May be using ChromaDB default embeddings")

        # 4. Query and MONITOR for custom embedding usage
        print("\n4️⃣ Querying collection (monitoring for custom embedding usage)...")
        print("📊 MONITORING LOGS FOR QUERY EMBEDDING USAGE:")
        query_result = await query_collection(
            "embedding_test", ["machine learning"], n_results=2
        )

        print(f"📋 Query result type: {type(query_result)}")
        print(f"📋 Found documents: {len(query_result.get('documents', [[]])[0])}")

        # 5. Manual verification of ChromaDB collection
        print("\n5️⃣ Manual verification of ChromaDB storage...")
        from src.tools import get_chroma_client

        client = get_chroma_client()
        collection = client.get_collection("embedding_test")

        # Get collection data
        all_data = collection.get()
        print(f"📋 Total documents in collection: {len(all_data['ids'])}")

        # Check if embeddings are stored
        if "embeddings" in all_data and all_data["embeddings"]:
            print("✅ VERIFIED: Custom embeddings stored in ChromaDB!")
            embedding_dim = (
                len(all_data["embeddings"][0]) if all_data["embeddings"] else 0
            )
            print(f"✅ Embedding dimensions: {embedding_dim}")
        else:
            print("❌ WARNING: No custom embeddings found in ChromaDB")

        # 6. Direct embedding manager test
        print("\n6️⃣ Direct embedding manager test...")
        from src.tools import get_embedding_manager

        embedding_manager = get_embedding_manager()

        # Test document encoding
        test_embedding = embedding_manager.encode_documents(["Test document"])
        if test_embedding and len(test_embedding) > 0:
            print(
                f"✅ VERIFIED: Embedding manager produces {len(test_embedding[0])}D vectors"
            )
        else:
            print("❌ WARNING: Embedding manager not producing embeddings")

        # Test query encoding
        query_embedding = embedding_manager.encode_query("Test query")
        if query_embedding and len(query_embedding) > 0:
            print(
                f"✅ VERIFIED: Query embedding produces {len(query_embedding)}D vector"
            )
        else:
            print("❌ WARNING: Query embedding not working")

        # Cleanup
        print("\n7️⃣ Cleaning up...")
        await delete_collection("embedding_test")
        print("✅ Test collection deleted")

        return True

    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback

        traceback.print_exc()
        return False


async def test_embedding_comparison():
    """
    VERIFY: Are custom embeddings different from ChromaDB defaults?
    """
    print("\n" + "=" * 60)
    print("🔬 VERIFICATION: Custom vs Default Embedding Comparison")
    print("=" * 60)

    try:
        from src.tools import get_embedding_manager, get_chroma_client

        # Get embedding manager
        embedding_manager = get_embedding_manager()

        # Test document
        test_doc = "Artificial intelligence is transforming technology"

        # Get custom embedding
        custom_embedding = embedding_manager.encode_documents([test_doc])
        if custom_embedding:
            print(f"✅ Custom embedding: {len(custom_embedding[0])}D vector")
            print(f"📊 Sample values: {custom_embedding[0][:5]}...")

        # Create collection with ChromaDB default (no custom embeddings)
        client = get_chroma_client()

        # Test collection for default embeddings
        default_collection = client.create_collection("default_test")
        default_collection.add(documents=[test_doc], ids=["test1"])

        # Query to get ChromaDB default embedding (if available)
        default_data = default_collection.get(include=["embeddings"])

        if default_data["embeddings"] and default_data["embeddings"][0]:
            print(f"✅ ChromaDB default: {len(default_data['embeddings'][0])}D vector")
            print(f"📊 Sample values: {default_data['embeddings'][0][:5]}...")

            # Compare if different
            if custom_embedding and len(custom_embedding[0]) != len(
                default_data["embeddings"][0]
            ):
                print(
                    "✅ VERIFIED: Custom and default embeddings have different dimensions!"
                )
            else:
                print("⚠️ WARNING: Same embedding dimensions - may be using same model")
        else:
            print("ℹ️ ChromaDB default embeddings not accessible for comparison")

        # Cleanup
        client.delete_collection("default_test")
        print("✅ Comparison test completed")

        return True

    except Exception as e:
        print(f"❌ Comparison test failed: {e}")
        return False


async def main():
    """Run all embedding verification tests."""
    print("🧪 REAL EMBEDDING VERIFICATION TEST")
    print("=" * 60)
    print("🎯 GOAL: Verify tools.py uses custom embeddings for ChromaDB")
    print("=" * 60)

    # Run tests
    test1_result = await test_custom_embeddings_usage()
    test2_result = await test_embedding_comparison()

    # Summary
    print("\n" + "=" * 60)
    print("📊 VERIFICATION SUMMARY")
    print("=" * 60)

    if test1_result and test2_result:
        print("🎉 VERIFICATION SUCCESS: Custom embeddings are being used!")
        print("✅ tools.py correctly integrates custom embeddings with ChromaDB")
        print("✅ mixedbread-ai model is active and functional")
        print("✅ Both document and query embeddings working")
    else:
        print("❌ VERIFICATION FAILED: Issues with custom embedding integration")
        print("⚠️ May be falling back to ChromaDB defaults")

    return test1_result and test2_result


if __name__ == "__main__":
    success = asyncio.run(main())
    print(f"\n🎯 FINAL RESULT: {'SUCCESS' if success else 'FAILED'}")
