# Aided with basic GitHub coding tools
"""
Base Provider Classes for AI Services
Defines abstract interfaces for STT, LLM, VLM, and TTS providers
"""

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, List, Union
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class AIModel:
    """Model configuration for AI providers"""
    pass
    pass
    pass  # ["stt", "llm", "vlm", "tts"]
    max_tokens = None
    supports_streaming = False
    cost_per_1k_tokens = None
    context_length = None
    description = ""

@dataclass 
class ProviderConfig:
    """Configuration for AI provider"""
    pass
    pass
    pass
    timeout = 30.0
    max_retries = 3
    rate_limit = None
    default_models = None  # {"stt": "model", "llm": "model", ...}

class BaseProvider(ABC):
    """Base class for all AI providers"""
    
    def __init__(self, config):
        self.config = config
        self.name = config.name
        self.api_key = config.api_key
        self.base_url = config.base_url
        self.timeout = config.timeout
        self.max_retries = config.max_retries
        
        if not self.api_key:
            logger.warning("No API key provided for {} provider".format(self.name))
    
    @abstractmethod
    async def health_check(self) :
        """Check if provider is healthy and accessible"""
        pass
    
    @abstractmethod
    def get_available_models(self) :
        """Get list of available models for this provider"""
        pass
    
    def is_available(self) :
        """Check if provider is available (has API key)"""
        return bool(self.api_key)

class BaseSTTProvider(BaseProvider):
    """Base Speech-to-Text provider interface"""
    
    @abstractmethod
    async def transcribe(
        self, 
        audio_data, 
        model = None,
        language = "en",
        **kwargs
    ) :
        """Convert audio to text"""
        pass
    
    @abstractmethod
    def get_supported_formats(self) :
        """Get supported audio formats"""
        pass

class BaseLLMProvider(BaseProvider):
    """Base Large Language Model provider interface"""
    
    @abstractmethod
    async def analyze_intent(
        self, 
        transcript, 
        ui_tree = None,
        model = None,
        **kwargs
    ) :
        """Analyze user intent from transcript"""
        pass
    
    @abstractmethod
    async def generate_response(
        self, 
        prompt,
        model = None,
        temperature = 0.1,
        max_tokens = None,
        **kwargs
    ) :
        """Generate text response"""
        pass
    
    @abstractmethod
    async def chat_completion(
        self,
        messages,
        model = None,
        **kwargs
    ) :
        """Chat completion with message history"""
        pass

class BaseVLMProvider(BaseProvider):
    """Base Vision-Language Model provider interface"""
    
    @abstractmethod
    async def locate_ui_element(
        self, 
        screenshot, 
        intent,
        model = None,
        **kwargs
    ) :
        """Locate UI elements in screenshot"""
        pass
    
    @abstractmethod
    async def analyze_screen_context(
        self, 
        screenshot,
        model = None,
        **kwargs
    ) :
        """Analyze overall screen context"""
        pass
    
    @abstractmethod
    async def describe_image(
        self, 
        image_data,
        prompt = None,
        model = None,
        **kwargs
    ) :
        """Generate image description"""
        pass

class BaseTTSProvider(BaseProvider):
    """Base Text-to-Speech provider interface"""
    
    @abstractmethod
    async def generate_speech(
        self, 
        text, 
        voice = None,
        model = None,
        **kwargs
    ) :
        """Generate speech audio from text"""
        pass
    
    @abstractmethod
    def get_available_voices(self) :
        """Get available voices for TTS"""
        pass
    
    @abstractmethod
    def get_supported_formats(self) :
        """Get supported audio output formats"""
        pass

class ProviderError(Exception):
    """Base exception for provider errors"""
    
    def __init__(self, message, provider, error_code = None):
        super().__init__(message)
        self.provider = provider
        self.error_code = error_code

class ModelNotAvailableError(ProviderError):
    """Raised when requested model is not available"""
    pass

class ProviderUnavailableError(ProviderError):
    """Raised when provider is not available"""
    pass

class RateLimitError(ProviderError):
    """Raised when rate limit is exceeded"""
    pass
