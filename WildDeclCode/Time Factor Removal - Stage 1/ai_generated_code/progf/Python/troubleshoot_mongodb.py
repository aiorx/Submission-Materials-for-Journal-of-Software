import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

async def test_mongodb_connection():
    """Test MongoDB connection and CRUD operations"""
    try:
        # Get connection details
        mongo_uri = os.getenv("MONGO_URI")
        db_name = os.getenv("MONGODB_DB_NAME", "llm_chat_db")
        
        if not mongo_uri:
            logger.error("MONGO_URI environment variable is not set")
            return
            
        logger.info("Testing MongoDB connection to {}@****".format(mongo_uri.split('@')[0]))
        
        # Create client
        client = AsyncIOMotorClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Test connection
        server_info = await client.server_info()
        logger.info("Successfully connected to MongoDB. Server version: {}".format(server_info.get('version')))
        
        # Test database access
        db = client[db_name]
        logger.info("Accessing database: {}".format(db_name))
        
        # Test collection operations
        test_collection = db.connection_test
        
        # Insert test document
        logger.info("Inserting test document...")
        test_doc = {"test": "connection", "message": "Testing MongoDB connection"}
        insert_result = await test_collection.insert_one(test_doc)
        logger.info("Document inserted with ID: {}".format(insert_result.inserted_id))
        
        # Find the document
        logger.info("Finding the inserted document...")
        found_doc = await test_collection.find_one({"_id": insert_result.inserted_id})
        logger.info("Found document: {}".format(found_doc))
        
        # Update the document
        logger.info("Updating the document...")
        update_result = await test_collection.update_one(
            {"_id": insert_result.inserted_id},
            {"$set": {"updated": True}}
        )
        logger.info("Document updated: {} document(s) modified".format(update_result.modified_count))
        
        # Find the updated document
        updated_doc = await test_collection.find_one({"_id": insert_result.inserted_id})
        logger.info("Updated document: {}".format(updated_doc))
        
        # Delete the document
        logger.info("Deleting the document...")
        delete_result = await test_collection.delete_one({"_id": insert_result.inserted_id})
        logger.info("Document deleted: {} document(s) deleted".format(delete_result.deleted_count))
        
        # Test chat thread collection
        chat_threads_collection = db.chat_threads
        logger.info("Testing chat_threads collection...")
        
        # Count documents
        count = await chat_threads_collection.count_documents({})
        logger.info("Current number of chat threads: {}".format(count))
        
        logger.info("All MongoDB operations completed successfully!")
        
    except Exception as e:
        logger.error("MongoDB test failed: {}".format(str(e)), exc_info=True)
    finally:
        if 'client' in locals():
            client.close()
            logger.info("MongoDB connection closed")

if __name__ == "__main__":
    asyncio.run(test_mongodb_connection())

# Assisted using common GitHub development utilities
