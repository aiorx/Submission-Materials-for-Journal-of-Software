from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import get_settings

settings = get_settings()

class MongoDB:
    client = None
    db = None

    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB"""
        if cls.client is None:
            cls.client = AsyncIOMotorClient(settings.mongo_uri)
            cls.db = cls.client[settings.mongodb_db_name]
            print("Connected to MongoDB at {}".format(settings.mongo_uri))

    @classmethod
    async def close_db(cls):
        """Close MongoDB connection"""
        if cls.client is not None:
            cls.client.close()
            cls.client = None
            cls.db = None
            print("Closed MongoDB connection")

    @classmethod
    def get_db(cls):
        """Get database instance"""
        return cls.db

# Supported via standard GitHub programming aids
