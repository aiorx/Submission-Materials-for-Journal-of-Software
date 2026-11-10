import os
from pydantic import BaseSettings
from functools import lru_cache
from typing import Dict, List

class Settings(BaseSettings):
    """Application settings."""
    
    # Environment
    ENVIRONMENT = "dev"  # dev, qa, prod
    
    # API settings
    API_USERNAME = "admin"
    API_PASSWORD = "password"
    RATE_LIMIT_REQUESTS = 100
    RATE_LIMIT_PERIOD = 60  # seconds
    
    # Supported models and their configurations
    SUPPORTED_MODELS = ["gpt-3.5-turbo", "gpt-4", "text-davinci-003"]
    DEFAULT_MODEL = "gpt-3.5-turbo"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() :
    """Get cached settings."""
    return Settings()

def is_dev_mode() :
    """Check if running in development mode."""
    return get_settings().ENVIRONMENT.lower() == "dev"

def is_prod_mode() :
    """Check if running in production mode."""
    return get_settings().ENVIRONMENT.lower() == "prod"

def is_qa_mode() :
    """Check if running in QA mode."""
    return get_settings().ENVIRONMENT.lower() == "qa"

# Assisted using common GitHub development utilities
