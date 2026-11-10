# Aided with basic GitHub coding tools
"""
Provider Registry for Dynamic AI Provider Management
Manages multiple AI providers with automatic failover and load balancing
Enhanced with intelligent auto model selection
"""

import os
import asyncio
from typing import Dict, List, Optional, Any, Union, Type
from dataclasses import dataclass, field
from enum import Enum
import logging
from dotenv import load_dotenv

from .base import (
    BaseSTTProvider, BaseLLMProvider, BaseVLMProvider, BaseTTSProvider,
    AIModel, ProviderConfig, ProviderError, ModelNotAvailableError,
    ProviderUnavailableError, RateLimitError
)
from .groq_provider import GroqProvider
from .gemini_provider import GeminiProvider
from .auto_model_selector import auto_selector, TaskComplexity, PerformanceMode

logger = logging.getLogger(__name__)

class ServiceType(Enum):
    """AI service types"""
    STT = "stt"
    LLM = "llm" 
    VLM = "vlm"
    TTS = "tts"

@dataclass
class ProviderPriority:
    """Provider priority configuration"""
    pass
    priority = 0  # Higher number = higher priority
    max_requests_per_minute = None
    cost_multiplier = 1.0
    enabled = True

@dataclass
class ServiceConfig:
    """Configuration for a specific service type"""
    pass
    pass
    fallback_providers = field(default_factory=list)
    default_model = None
    provider_priorities = field(default_factory=list)
    enable_fallback = True
    timeout = 30.0

class ProviderRegistry:
    """
    Central registry for managing multiple AI providers
    Handles provider selection, failover, and load balancing
    """
    
    def __init__(self):
        # Load environment variables to ensure API keys are available
        load_dotenv()
        
        self.providers = {}
        self.service_configs = {}
        self._initialize_providers()
        self._setup_default_configs()
    
    def _initialize_providers(self):
        """Initialize all available providers"""
        
        # Initialize Groq provider
        groq_config = ProviderConfig(
            name="groq",
            api_key=os.getenv("GROQ_API_KEY", ""),
            base_url="https://api.groq.com/openai/v1",
            timeout=30.0,
            max_retries=3,
            default_models={
                "stt": "whisper-large-v3-turbo",
                "llm": "llama-3.3-70b-versatile", 
                "vlm": "llama-4-maverick-17b-128e-instruct",
                "tts": "playai-tts"
            }
        )
        
        if groq_config.api_key:
            self.providers["groq"] = GroqProvider(groq_config)
            logger.info("Groq provider initialized")
        else:
            logger.warning("Groq API key not found, provider disabled")
        
        # Initialize Gemini provider
        gemini_config = ProviderConfig(
            name="gemini",
            api_key=os.getenv("GEMINI_API_KEY", ""),
            base_url="https://generativelanguage.googleapis.com/v1beta",
            timeout=30.0,
            max_retries=3,
            default_models={
                "llm": "gemini-1.5-flash",     # Stable, fast model
                "vlm": "gemini-1.5-flash"      # Stable, fast model
            }
        )
        
        if gemini_config.api_key:
            self.providers["gemini"] = GeminiProvider(gemini_config)
            logger.info("Gemini provider initialized")
        else:
            logger.warning("Gemini API key not found, provider disabled")
    
    def _setup_default_configs(self):
        """Setup default service configurations"""
        
        # STT Service Configuration
        self.service_configs[ServiceType.STT] = ServiceConfig(
            service_type=ServiceType.STT,
            default_provider="groq",  # Only Groq supports STT
            fallback_providers=[],
            default_model="whisper-large-v3-turbo"
        )
        
        # LLM Service Configuration  
        self.service_configs[ServiceType.LLM] = ServiceConfig(
            service_type=ServiceType.LLM,
            default_provider=os.getenv("DEFAULT_LLM_PROVIDER", "groq"),
            fallback_providers=["gemini", "groq"],
            default_model=os.getenv("DEFAULT_LLM_MODEL"),
            provider_priorities=[
                ProviderPriority("groq", priority=1, cost_multiplier=1.0),
                ProviderPriority("gemini", priority=2, cost_multiplier=1.2)
            ]
        )
        
        # VLM Service Configuration
        self.service_configs[ServiceType.VLM] = ServiceConfig(
            service_type=ServiceType.VLM,
            default_provider=os.getenv("DEFAULT_VLM_PROVIDER", "groq"),
            fallback_providers=["gemini", "groq"],
            default_model=os.getenv("DEFAULT_VLM_MODEL"),
            provider_priorities=[
                ProviderPriority("groq", priority=1, cost_multiplier=1.0),
                ProviderPriority("gemini", priority=2, cost_multiplier=0.8)  # Gemini might be cheaper
            ]
        )
        
        # TTS Service Configuration
        self.service_configs[ServiceType.TTS] = ServiceConfig(
            service_type=ServiceType.TTS,
            default_provider="groq",  # Only Groq supports TTS
            fallback_providers=[],
            default_model="playai-tts"
        )
    
    def get_provider(
        self, 
        service_type, 
        provider_name = None
    ) :
        """Get provider for specific service type"""
        
        if provider_name:
            # Use specified provider
            if provider_name in self.providers:
                provider = self.providers[provider_name]
                if self._provider_supports_service(provider, service_type):
                    return provider
                else:
                    logger.warning("Provider {} doesn't support {}".format(provider_name, service_type.value))
                    return None
            else:
                logger.error("Provider {} not found".format(provider_name))
                return None
        
        # Use default provider selection
        config = self.service_configs.get(service_type)
        if not config:
            logger.error("No configuration found for service type {}".format(service_type.value))
            return None
        
        # Try default provider first
        if config.default_provider in self.providers:
            provider = self.providers[config.default_provider]
            if provider.is_available() and self._provider_supports_service(provider, service_type):
                return provider
        
        # Try fallback providers
        for fallback_provider in config.fallback_providers:
            if fallback_provider in self.providers:
                provider = self.providers[fallback_provider]
                if provider.is_available() and self._provider_supports_service(provider, service_type):
                    logger.info("Using fallback provider {} for {}".format(fallback_provider, service_type.value))
                    return provider
        
        logger.error("No available provider found for service type {}".format(service_type.value))
        return None
    
    def _provider_supports_service(self, provider, service_type) :
        """Check if provider supports the service type"""
        if service_type == ServiceType.STT:
            return isinstance(provider, BaseSTTProvider)
        elif service_type == ServiceType.LLM:
            return isinstance(provider, BaseLLMProvider)
        elif service_type == ServiceType.VLM:
            return isinstance(provider, BaseVLMProvider)
        elif service_type == ServiceType.TTS:
            return isinstance(provider, BaseTTSProvider)
        return False
    
    async def execute_with_fallback(
        self,
        service_type,
        method_name,
        provider_name = None,
        model = None,
        **kwargs
    ) :
        """
        Execute AI service method with automatic fallback
        """
        config = self.service_configs.get(service_type)
        if not config:
            return {"success": False, "error": "No configuration for {}".format(service_type.value)}
        
        # Determine providers to try
        providers_to_try = []
        
        if provider_name:
            # Use specified provider only
            if provider_name in self.providers:
                providers_to_try = [provider_name]
            else:
                return {"success": False, "error": "Provider {} not found".format(provider_name)}
        else:
            # Use default + fallbacks
            providers_to_try = [config.default_provider] + config.fallback_providers
            # Remove duplicates while preserving order
            providers_to_try = list(dict.fromkeys(providers_to_try))
        
        last_error = None
        
        for provider_name in providers_to_try:
            if provider_name not in self.providers:
                continue
                
            provider = self.providers[provider_name]
            
            if not provider.is_available():
                logger.warning("Provider {} not available".format(provider_name))
                continue
                
            if not self._provider_supports_service(provider, service_type):
                logger.warning("Provider {} doesn't support {}".format(provider_name, service_type.value))
                continue
            
            try:
                # Get the method to call
                if not hasattr(provider, method_name):
                    logger.warning("Provider {} doesn't have method {}".format(provider_name, method_name))
                    continue
                
                method = getattr(provider, method_name)
                
                # Use provider's default model if none specified
                if not model and hasattr(provider.config, 'default_models'):
                    model = provider.config.default_models.get(service_type.value)
                
                # Execute the method
                logger.info("Executing {} on {} with model {}".format(method_name, provider_name, model))
                
                if asyncio.iscoroutinefunction(method):
                    if model:
                        result = await method(model=model, **kwargs)
                    else:
                        result = await method(**kwargs)
                else:
                    if model:
                        result = method(model=model, **kwargs)
                    else:
                        result = method(**kwargs)
                
                # Check if result indicates success
                if self._is_successful_result(result, service_type):
                    logger.info("Successfully executed {} on {}".format(method_name, provider_name))
                    return {
                        "success": True,
                        "result": result,
                        "provider_used": provider_name,
                        "model_used": model
                    }
                else:
                    logger.warning("Method {} on {} returned unsuccessful result".format(method_name, provider_name))
                    last_error = "Provider {} returned unsuccessful result".format(provider_name)
                    
            except RateLimitError as e:
                logger.warning("Rate limit hit on {}, trying next provider".format(provider_name))
                last_error = str(e)
                continue
                
            except ProviderUnavailableError as e:
                logger.warning("Provider {} unavailable: {}".format(provider_name, str(e)))
                last_error = str(e)
                continue
                
            except Exception as e:
                logger.error("Error executing {} on {}: {}".format(method_name, provider_name, str(e)))
                last_error = str(e)
                
                # Don't continue to fallback for certain errors
                if not config.enable_fallback:
                    break
                    
                continue
        
        # All providers failed
        return {
            "success": False,
            "error": last_error or "All providers failed for {}".format(service_type.value),
            "providers_tried": providers_to_try
        }
    
    def _is_successful_result(self, result, service_type) :
        """Check if result indicates success"""
        if result is None:
            return False
            
        if isinstance(result, dict):
            # For methods that return dict with success/error indicators
            if "error" in result:
                return False
            if "success" in result:
                return result["success"]
            if service_type == ServiceType.VLM and "found" in result:
                return result["found"]
                
        if isinstance(result, str):
            # For methods that return string (like transcribe, generate_response)
            return bool(result.strip())
            
        if isinstance(result, bytes):
            # For methods that return bytes (like TTS)
            return len(result) > 0
        
        # Default: assume non-None result is successful
        return True
    
    async def execute_with_auto_selection(
        self,
        service_type,
        method_name,
        text = "",
        context = None,
        performance_mode = "balanced",
        cost_sensitive = True,
        auto_mode = True,
        **kwargs
    ) :
        """
        Execute AI service method with intelligent auto model selection
        Falls back to manual selection if auto mode fails
        """
        provider_name = kwargs.pop("provider", None)
        model = kwargs.pop("model", None)
        
        # If auto mode is enabled and no explicit provider/model specified
        if auto_mode and not provider_name and not model:
            try:
                # Use auto selector to choose optimal provider and model
                auto_provider, auto_model = auto_selector.select_model(
                    service_type.value,
                    text=text,
                    context=context,
                    performance_mode=performance_mode,
                    cost_sensitive=cost_sensitive
                )
                
                if auto_provider and auto_model:
                    logger.info("Auto-selected {}/{} for {}".format(auto_provider, auto_model, service_type.value))
                    
                    # Try the auto-selected combination first
                    result = await self.execute_with_fallback(
                        service_type=service_type,
                        method_name=method_name,
                        provider_name=auto_provider,
                        model=auto_model,
                        **kwargs
                    )
                    
                    if result.get("success"):
                        # Add auto selection metadata
                        result["auto_selected"] = True
                        result["selection_criteria"] = {
                            "provider": auto_provider,
                            "model": auto_model,
                            "performance_mode": performance_mode,
                            "cost_sensitive": cost_sensitive
                        }
                        return result
                    else:
                        logger.warning("Auto-selected model failed, falling back to default selection")
                        
                        # Try fallback models from auto selector
                        fallback_models = auto_selector.get_fallback_models(service_type.value, auto_provider)
                        for fallback_provider, fallback_model in fallback_models:
                            logger.info("Trying fallback: {}/{}".format(fallback_provider, fallback_model))
                            fallback_result = await self.execute_with_fallback(
                                service_type=service_type,
                                method_name=method_name,
                                provider_name=fallback_provider,
                                model=fallback_model,
                                **kwargs
                            )
                            
                            if fallback_result.get("success"):
                                fallback_result["auto_selected"] = True
                                fallback_result["fallback_used"] = True
                                return fallback_result
                        
            except Exception as e:
                logger.error("Auto selection failed: {}, falling back to default".format(str(e)))
        
        # Fall back to normal execution with fallback
        return await self.execute_with_fallback(
            service_type=service_type,
            method_name=method_name,
            provider_name=provider_name,
            model=model,
            **kwargs
        )
    
    def get_auto_selection_recommendation(
        self,
        service_type,
        text = "",
        context = None,
        performance_mode = "balanced",
        cost_sensitive = True
    ) :
        """
        Get auto selection recommendation without executing
        Useful for UI/API to show what would be selected
        """
        try:
            provider, model = auto_selector.select_model(
                service_type,
                text=text,
                context=context,
                performance_mode=performance_mode,
                cost_sensitive=cost_sensitive
            )
            
            if provider and model:
                # Analyze the task for explanation
                criteria = auto_selector.analyze_task_complexity(text, context)
                explanation = auto_selector.explain_selection(service_type, provider, model, criteria)
                
                return {
                    "provider": provider,
                    "model": model,
                    "criteria": {
                        "complexity": criteria.task_complexity.value,
                        "performance_mode": criteria.performance_mode.value,
                        "context_length": criteria.context_length_needed,
                        "requires_coding": criteria.requires_coding,
                        "requires_reasoning": criteria.requires_reasoning,
                        "multimodal": criteria.has_images or criteria.has_audio,
                        "cost_sensitive": criteria.cost_sensitive
                    },
                    "explanation": explanation,
                    "fallback_options": auto_selector.get_fallback_models(service_type, provider)
                }
            else:
                return {"error": "No recommendation available"}
                
        except Exception as e:
            logger.error("Error getting auto selection recommendation: {}".format(str(e)))
            return {"error": str(e)}
    
    def configure_auto_mode(
        self,
        enabled = True,
        default_performance_mode = "balanced",
        cost_sensitivity = True
    ) :
        """
        Configure auto mode settings
        """
        try:
            # Store auto mode configuration
            if not hasattr(self, '_auto_config'):
                self._auto_config = {}
            
            self._auto_config.update({
                "enabled": enabled,
                "default_performance_mode": default_performance_mode,
                "cost_sensitivity": cost_sensitivity
            })
            
            logger.info("Auto mode configured: enabled={}, mode={}".format(enabled, default_performance_mode))
            
            return {
                "success": True,
                "config": self._auto_config
            }
            
        except Exception as e:
            logger.error("Error configuring auto mode: {}".format(str(e)))
            return {"error": str(e)}
    
    def get_auto_mode_config(self) :
        """Get current auto mode configuration"""
        if hasattr(self, '_auto_config'):
            return self._auto_config
        else:
            return {
                "enabled": True,
                "default_performance_mode": "balanced",
                "cost_sensitivity": True
            }

    async def health_check(self) :
        """Check health of all providers"""
        health_status = {}
        
        for provider_name, provider in self.providers.items():
            try:
                status = await provider.health_check()
                health_status[provider_name] = status
            except Exception as e:
                health_status[provider_name] = {
                    "status": "error",
                    "error": str(e)
                }
        
        return {
            "overall_status": "healthy" if any(
                status.get("status") == "healthy" 
                for status in health_status.values()
            ) else "unhealthy",
            "providers": health_status
        }
    
    def get_available_models(
        self, 
        service_type = None,
        provider_name = None
    ) :
        """Get available models for service type and/or provider"""
        models = []
        
        providers_to_check = []
        if provider_name:
            if provider_name in self.providers:
                providers_to_check = [self.providers[provider_name]]
        else:
            providers_to_check = list(self.providers.values())
        
        for provider in providers_to_check:
            provider_models = provider.get_available_models()
            
            if service_type:
                # Filter by service type
                provider_models = [
                    model for model in provider_models 
                    if service_type.value in model.capabilities
                ]
            
            models.extend(provider_models)
        
        return models
    
    def update_service_config(
        self, 
        service_type, 
        config
    ):
        """Update service configuration"""
        self.service_configs[service_type] = config
        logger.info("Updated configuration for {}".format(service_type.value))
    
    def set_default_provider(
        self, 
        service_type, 
        provider_name
    ):
        """Set default provider for service type"""
        if service_type in self.service_configs:
            self.service_configs[service_type].default_provider = provider_name
            logger.info("Set default {} provider to {}".format(service_type.value, provider_name))
        else:
            logger.error("No configuration found for {}".format(service_type.value))
    
    def set_default_model(
        self, 
        service_type, 
        model_name
    ):
        """Set default model for service type"""
        if service_type in self.service_configs:
            self.service_configs[service_type].default_model = model_name
            logger.info("Set default {} model to {}".format(service_type.value, model_name))
        else:
            logger.error("No configuration found for {}".format(service_type.value))
    
    def get_provider_info(self) :
        """Get information about all providers and their capabilities"""
        provider_info = {}
        
        for provider_name, provider in self.providers.items():
            models = provider.get_available_models()
            capabilities = set()
            for model in models:
                capabilities.update(model.capabilities)
            
            provider_info[provider_name] = {
                "available": provider.is_available(),
                "capabilities": list(capabilities),
                "models": [
                    {
                        "name": model.name,
                        "capabilities": model.capabilities,
                        "description": model.description
                    }
                    for model in models
                ]
            }
        
        return provider_info

# Global registry instance
provider_registry = ProviderRegistry()
