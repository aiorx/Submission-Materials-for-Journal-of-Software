# Assisted using common GitHub development utilities
"""
API endpoints for AI provider management
Allows dynamic switching between providers and models
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
import logging

from providers.provider_registry import provider_registry, ServiceType
from ai_services import stt_service, llm_service, vlm_service, tts_service

logger = logging.getLogger(__name__)

# Router for provider management endpoints
provider_router = APIRouter(prefix="/providers", tags=["AI Providers"])

class ProviderSwitchRequest(BaseModel):
    """Request model for switching providers"""
    pass  # "stt", "llm", "vlm", "tts"
    pass
    model = None

class ModelTestRequest(BaseModel):
    """Request model for testing models"""
    pass
    provider = None
    model = None
    pass  # Text for LLM, base64 audio for STT, etc.

class ProviderResponse(BaseModel):
    """Response model for provider operations"""
    pass
    pass
    data = None

@provider_router.get("/health", response_model=Dict[str, Any])
async def check_providers_health():
    """Check health status of all AI providers"""
    try:
        health_status = await provider_registry.health_check()
        return health_status
    except Exception as e:
        logger.error("Health check error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

@provider_router.get("/info", response_model=Dict[str, Any])
async def get_providers_info():
    """Get detailed information about all providers"""
    try:
        provider_info = provider_registry.get_provider_info()
        service_configs = {}
        
        for service_type, config in provider_registry.service_configs.items():
            service_configs[service_type.value] = {
                "default_provider": config.default_provider,
                "fallback_providers": config.fallback_providers,
                "default_model": config.default_model,
                "enable_fallback": config.enable_fallback
            }
        
        return {
            "providers": provider_info,
            "service_configs": service_configs,
            "available_services": [service.value for service in ServiceType]
        }
    except Exception as e:
        logger.error("Provider info error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

@provider_router.get("/models", response_model=List[Dict[str, Any]])
async def get_available_models(
    service_type = Query(None, description="Filter by service type (stt, llm, vlm, tts)"),
    provider = Query(None, description="Filter by provider name")
):
    """Get available models for specific service type and/or provider"""
    try:
        service_filter = None
        if service_type:
            try:
                service_filter = ServiceType(service_type)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid service type: {}".format(service_type))
        
        models = provider_registry.get_available_models(
            service_type=service_filter,
            provider_name=provider
        )
        
        return [
            {
                "name": model.name,
                "provider": model.provider,
                "capabilities": model.capabilities,
                "max_tokens": model.max_tokens,
                "context_length": model.context_length,
                "description": model.description,
                "supports_streaming": model.supports_streaming
            }
            for model in models
        ]
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Models retrieval error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

@provider_router.post("/switch", response_model=ProviderResponse)
async def switch_provider(request):
    """Switch default provider for a service type"""
    try:
        # Validate service type
        try:
            service_type = ServiceType(request.service_type)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid service type: {}".format(request.service_type))
        
        # Check if provider exists and supports the service
        provider = provider_registry.get_provider(service_type, request.provider)
        if not provider:
            raise HTTPException(
                status_code=400, 
                detail="Provider '{}' not found or doesn't support {}".format(request.provider, request.service_type)
            )
        
        # Update default provider
        provider_registry.set_default_provider(service_type, request.provider)
        
        # Update default model if provided
        if request.model:
            provider_registry.set_default_model(service_type, request.model)
        
        return ProviderResponse(
            success=True,
            message="Switched {} provider to {}".format(request.service_type, request.provider),
            data={
                "service_type": request.service_type,
                "provider": request.provider,
                "model": request.model
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Provider switch error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

@provider_router.post("/test", response_model=ProviderResponse)
async def test_model(request):
    """Test a specific model with sample input"""
    try:
        # Validate service type
        try:
            service_type = ServiceType(request.service_type)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid service type: {}".format(request.service_type))
        
        result = None
        
        if service_type == ServiceType.STT:
            # For STT testing, expect base64 encoded audio
            import base64
            try:
                audio_data = base64.b64decode(request.test_input)
                result = await stt_service.transcribe(
                    audio_data, 
                    provider=request.provider,
                    model=request.model
                )
            except Exception as e:
                raise HTTPException(status_code=400, detail="Invalid audio data: {}".format(str(e)))
                
        elif service_type == ServiceType.LLM:
            # For LLM testing, use text input directly
            result = await llm_service.generate_response(
                request.test_input,
                provider=request.provider,
                model=request.model
            )
            
        elif service_type == ServiceType.VLM:
            # For VLM testing, expect base64 encoded image
            import base64
            try:
                image_data = base64.b64decode(request.test_input)
                result = await vlm_service.analyze_screen_context(
                    image_data,
                    provider=request.provider,
                    model=request.model
                )
            except Exception as e:
                raise HTTPException(status_code=400, detail="Invalid image data: {}".format(str(e)))
                
        elif service_type == ServiceType.TTS:
            # For TTS testing, return audio size instead of actual audio
            audio_result = await tts_service.generate_speech(
                request.test_input,
                provider=request.provider,
                model=request.model
            )
            result = {"audio_generated": bool(audio_result), "audio_size": len(audio_result) if audio_result else 0}
        
        if result is not None:
            return ProviderResponse(
                success=True,
                message="Successfully tested {} model".format(request.service_type),
                data={
                    "service_type": request.service_type,
                    "provider": request.provider,
                    "model": request.model,
                    "result": result
                }
            )
        else:
            return ProviderResponse(
                success=False,
                message="Test failed for {} model".format(request.service_type),
                data={
                    "service_type": request.service_type,
                    "provider": request.provider,
                    "model": request.model
                }
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Model test error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

@provider_router.get("/voices", response_model=List[Dict[str, str]])
async def get_available_voices(provider = Query(None, description="Filter by provider")):
    """Get available TTS voices"""
    try:
        if provider:
            provider_obj = provider_registry.get_provider(ServiceType.TTS, provider)
            if not provider_obj:
                raise HTTPException(status_code=404, detail="TTS provider '{}' not found".format(provider))
            return provider_obj.get_available_voices()
        else:
            # Get voices from all TTS providers
            voices = []
            for provider_name, provider_obj in provider_registry.providers.items():
                if hasattr(provider_obj, 'get_available_voices'):
                    provider_voices = provider_obj.get_available_voices()
                    for voice in provider_voices:
                        voice['provider'] = provider_name
                    voices.extend(provider_voices)
            return voices
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Voices retrieval error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

@provider_router.get("/config/{service_type}")
async def get_service_config(service_type):
    """Get configuration for a specific service type"""
    try:
        try:
            service_enum = ServiceType(service_type)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid service type: {}".format(service_type))
        
        config = provider_registry.service_configs.get(service_enum)
        if not config:
            raise HTTPException(status_code=404, detail="No configuration found for {}".format(service_type))
        
        return {
            "service_type": service_type,
            "default_provider": config.default_provider,
            "fallback_providers": config.fallback_providers,
            "default_model": config.default_model,
            "enable_fallback": config.enable_fallback,
            "timeout": config.timeout
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Service config error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

@provider_router.post("/config/{service_type}/model")
async def set_default_model(service_type, model = Query(..., description="Model name")):
    """Set default model for a service type"""
    try:
        try:
            service_enum = ServiceType(service_type)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid service type: {}".format(service_type))
        
        provider_registry.set_default_model(service_enum, model)
        
        return ProviderResponse(
            success=True,
            message="Set default {} model to {}".format(service_type, model),
            data={"service_type": service_type, "model": model}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Set model error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

# Auto Selection Endpoints

class AutoSelectionRequest(BaseModel):
    """Request model for auto selection recommendation"""
    pass
    text = ""
    context = None
    performance_mode = "balanced"  # speed, balanced, quality, cost
    cost_sensitive = True

class AutoModeConfigRequest(BaseModel):
    """Request model for auto mode configuration"""
    enabled = True
    default_performance_mode = "balanced"
    cost_sensitivity = True

@provider_router.post("/auto-select/recommend", response_model=Dict[str, Any])
async def get_auto_selection_recommendation(request):
    """Get AI model recommendation based on task analysis"""
    try:
        recommendation = provider_registry.get_auto_selection_recommendation(
            service_type=request.service_type,
            text=request.text,
            context=request.context,
            performance_mode=request.performance_mode,
            cost_sensitive=request.cost_sensitive
        )
        
        if "error" in recommendation:
            raise HTTPException(status_code=400, detail=recommendation["error"])
        
        return {
            "success": True,
            "recommendation": recommendation,
            "auto_mode": True
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Auto selection recommendation error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

@provider_router.post("/auto-select/config", response_model=ProviderResponse)
async def configure_auto_mode(request):
    """Configure auto mode settings"""
    try:
        result = provider_registry.configure_auto_mode(
            enabled=request.enabled,
            default_performance_mode=request.default_performance_mode,
            cost_sensitivity=request.cost_sensitivity
        )
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return ProviderResponse(
            success=True,
            message="Auto mode configured successfully",
            data=result["config"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Auto mode config error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

@provider_router.get("/auto-select/config", response_model=Dict[str, Any])
async def get_auto_mode_config():
    """Get current auto mode configuration"""
    try:
        config = provider_registry.get_auto_mode_config()
        return {
            "success": True,
            "config": config
        }
    except Exception as e:
        logger.error("Get auto mode config error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

@provider_router.post("/auto-select/explain", response_model=Dict[str, Any])
async def explain_model_selection(request):
    """Get detailed explanation of why a specific model was selected"""
    try:
        from providers.auto_model_selector import auto_selector
        
        # Get the recommendation
        provider, model = auto_selector.select_model(
            service_type=request.service_type,
            text=request.text,
            context=request.context,
            performance_mode=request.performance_mode,
            cost_sensitive=request.cost_sensitive
        )
        
        if not provider or not model:
            raise HTTPException(status_code=400, detail="Could not determine model selection")
        
        # Analyze task complexity for detailed explanation
        criteria = auto_selector.analyze_task_complexity(request.text, request.context)
        explanation = auto_selector.explain_selection(request.service_type, provider, model, criteria)
        
        return {
            "success": True,
            "selection": {
                "provider": provider,
                "model": model
            },
            "analysis": {
                "complexity": criteria.task_complexity.value,
                "performance_mode": criteria.performance_mode.value,
                "context_length_needed": criteria.context_length_needed,
                "requires_coding": criteria.requires_coding,
                "requires_reasoning": criteria.requires_reasoning,
                "multimodal": criteria.has_images or criteria.has_audio or criteria.has_video,
                "cost_sensitive": criteria.cost_sensitive
            },
            "explanation": explanation,
            "fallback_options": auto_selector.get_fallback_models(request.service_type, provider)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Model selection explanation error: {}".format(str(e)))
        raise HTTPException(status_code=500, detail=str(e))

@provider_router.get("/auto-select/performance-modes", response_model=List[str])
async def get_performance_modes():
    """Get available performance modes for auto selection"""
    return ["speed", "balanced", "quality", "cost"]

@provider_router.get("/auto-select/complexity-levels", response_model=List[str])
async def get_complexity_levels():
    """Get available task complexity levels"""
    return ["simple", "medium", "complex", "multimodal"]
