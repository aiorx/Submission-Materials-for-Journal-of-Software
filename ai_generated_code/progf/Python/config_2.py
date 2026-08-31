# Assisted using common GitHub development utilities
"""
Configuration management for PolyMind project.
"""

from math import log
import os
from typing import Optional
from venv import logger
from dotenv import load_dotenv
from backend.utils.logger import get_async_logger

logger = get_async_logger(__name__)
# Load environment variables from .env file
load_dotenv()


class Config:
    """Application configuration."""

    # Together.xyz API configuration
    TOGETHER_API_KEY: Optional[str] = os.getenv("TOGETHER_API_KEY")
    TOGETHER_BASE_URL: str = "https://api.together.xyz/v1"

    # DeepSeek model configuration
    DEEPSEEK_MODEL: str = "deepseek-ai/DeepSeek-V3"
    DEEPSEEK_MAX_TOKENS: int = 4000
    DEEPSEEK_TEMPERATURE: float = 0.7

    # Llama 3 model configuration
    LLAMA3_MODEL: str = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"
    LLAMA3_MAX_TOKENS: int = 4096
    LLAMA3_TEMPERATURE: float = 0.7

    # Application settings
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    @classmethod
    def check_required_env(cls) -> bool:
        """Kiểm tra các environment variables bắt buộc."""
        if not cls.TOGETHER_API_KEY:
            print("❌ TOGETHER_API_KEY environment variable is not set")
            print("💡 Please set your Together.xyz API key:")
            print("   export TOGETHER_API_KEY=your_api_key_here")
            return False
        return True


# Global config instance
config = Config()
