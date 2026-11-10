# Assisted using common GitHub development utilities
"""
Updated AI service adapters using the new provider registry
Maintains backward compatibility while adding multi-provider support
"""

from providers.provider_registry import provider_registry, ServiceType
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class AIServiceAdapter:
    """Base adapter for AI services with provider registry integration"""
    
    def __init__(self, service_type):
        self.service_type = service_type
        self.registry = provider_registry
    
    async def _execute_with_fallback(
        self,
        method_name,
        provider = None,
        model = None,
        **kwargs
    ):
        """Execute method with automatic provider fallback"""
        return await self.registry.execute_with_fallback(
            service_type=self.service_type,
            method_name=method_name,
            provider_name=provider,
            model=model,
            **kwargs
        )

class STTService(AIServiceAdapter):
    """Speech-to-Text service adapter"""
    
    def __init__(self):
        super().__init__(ServiceType.STT)
    
    async def transcribe(
        self, 
        audio_data, 
        provider = None,
        model = None,
        language = "en",
        **kwargs
    ) :
        """Transcribe audio with provider selection"""
        try:
            result = await self._execute_with_fallback(
                method_name="transcribe",
                provider=provider,
                model=model,
                audio_data=audio_data,
                language=language,
                **kwargs
            )
            
            if result.get("success"):
                return result["result"]
            else:
                logger.error("STT failed: {}".format(result.get('error')))
                return None
                
        except Exception as e:
            logger.error("STT service error: {}".format(str(e)))
            return None

class LLMService(AIServiceAdapter):
    """Large Language Model service adapter"""
    
    def __init__(self):
        super().__init__(ServiceType.LLM)
    
    async def analyze_intent(
        self, 
        transcript, 
        ui_tree = None,
        provider = None,
        model = None,
        **kwargs
    ) :
        """Analyze intent with provider selection"""
        try:
            result = await self._execute_with_fallback(
                method_name="analyze_intent",
                provider=provider,
                model=model,
                transcript=transcript,
                ui_tree=ui_tree,
                **kwargs
            )
            
            if result.get("success"):
                return result["result"]
            else:
                return {"error": result.get("error", "Intent analysis failed")}
                
        except Exception as e:
            logger.error("LLM service error: {}".format(str(e)))
            return {"error": str(e)}
    
    async def generate_response(
        self, 
        prompt,
        provider = None,
        model = None,
        **kwargs
    ) :
        """Generate response with provider selection"""
        try:
            result = await self._execute_with_fallback(
                method_name="generate_response",
                provider=provider,
                model=model,
                prompt=prompt,
                **kwargs
            )
            
            if result.get("success"):
                return result["result"]
            else:
                logger.error("Response generation failed: {}".format(result.get('error')))
                return None
                
        except Exception as e:
            logger.error("LLM service error: {}".format(str(e)))
            return None

class VLMService(AIServiceAdapter):
    """Vision-Language Model service adapter"""
    
    def __init__(self):
        super().__init__(ServiceType.VLM)
    
    async def locate_ui_element(
        self, 
        screenshot, 
        intent,
        provider = None,
        model = None,
        **kwargs
    ) :
        """Locate UI element with provider selection"""
        try:
            result = await self._execute_with_fallback(
                method_name="locate_ui_element",
                provider=provider,
                model=model,
                screenshot=screenshot,
                intent=intent,
                **kwargs
            )
            
            if result.get("success"):
                return result["result"]
            else:
                return {"found": False, "error": result.get("error", "VLM analysis failed")}
                
        except Exception as e:
            logger.error("VLM service error: {}".format(str(e)))
            return {"found": False, "error": str(e)}
    
    async def analyze_screen_context(
        self, 
        screenshot,
        provider = None,
        model = None,
        **kwargs
    ) :
        """Analyze screen context with provider selection"""
        try:
            result = await self._execute_with_fallback(
                method_name="analyze_screen_context",
                provider=provider,
                model=model,
                screenshot=screenshot,
                **kwargs
            )
            
            if result.get("success"):
                return result["result"]
            else:
                return {"error": result.get("error", "Screen analysis failed")}
                
        except Exception as e:
            logger.error("VLM service error: {}".format(str(e)))
            return {"error": str(e)}

class TTSService(AIServiceAdapter):
    """Text-to-Speech service adapter"""
    
    def __init__(self):
        super().__init__(ServiceType.TTS)
    
    async def generate_speech(
        self, 
        text, 
        provider = None,
        model = None,
        voice = None,
        **kwargs
    ) :
        """Generate speech with provider selection"""
        try:
            result = await self._execute_with_fallback(
                method_name="generate_speech",
                provider=provider,
                model=model,
                text=text,
                voice=voice,
                **kwargs
            )
            
            if result.get("success"):
                return result["result"]
            else:
                logger.error("TTS failed: {}".format(result.get('error')))
                return None
                
        except Exception as e:
            logger.error("TTS service error: {}".format(str(e)))
            return None

# Global service instances for backward compatibility
stt_service = STTService()
llm_service = LLMService()  
vlm_service = VLMService()
tts_service = TTSService()

# Legacy compatibility aliases
class GroqSTT:
    """Legacy compatibility wrapper for STT"""
    
    async def transcribe(self, audio_data) :
        return await stt_service.transcribe(audio_data, provider="groq")

class GroqLLM:
    """Legacy compatibility wrapper for LLM"""
    
    async def analyze_intent(self, transcript, ui_tree = None) :
        return await llm_service.analyze_intent(transcript, ui_tree, provider="groq")

class GroqVLM:
    """Legacy compatibility wrapper for VLM"""
    
    async def locate_ui_element(self, screenshot, intent) :
        return await vlm_service.locate_ui_element(screenshot, intent, provider="groq")

class PlayAITTS:
    """Legacy compatibility wrapper for TTS"""
    
    async def generate_speech(self, text) :
        return await tts_service.generate_speech(text, provider="groq")

# Legacy instances
groq_stt = GroqSTT()
groq_llm = GroqLLM()
groq_vlm = GroqVLM()
playai_tts = PlayAITTS()
