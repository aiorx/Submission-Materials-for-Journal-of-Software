# Aided with basic GitHub coding tools
"""
Gemini Provider Implementation
Implements AI services using Google Gemini API
"""

import httpx
import json
import base64
import asyncio
from typing import Optional, Dict, Any, List
import logging

from .base import (
    BaseSTTProvider, BaseLLMProvider, BaseVLMProvider, BaseTTSProvider,
    AIModel, ProviderConfig, ProviderError, ModelNotAvailableError,
    RateLimitError, ProviderUnavailableError
)

logger = logging.getLogger(__name__)

class GeminiProvider(BaseLLMProvider, BaseVLMProvider):
    """
    Gemini provider for LLM and VLM services
    Note: Gemini doesn't provide STT/TTS, so we only implement LLM and VLM
    """
    
    def __init__(self, config: ProviderConfig):
        super().__init__(config)
        self._models = self._initialize_models()
        # Override base URL for Gemini
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
    
    def _initialize_models(self) -> List[AIModel]:
        """Initialize available Gemini models - Current Available Models Only"""
        return [
            # Current Production Gemini Models (Confirmed Available)
            AIModel(
                name="gemini-1.5-pro-latest",
                provider="gemini",
                capabilities=["llm", "vlm"],
                max_tokens=8192,
                context_length=2097152,  # 2M tokens
                cost_per_1k_tokens=0.025,
                description="Most capable Gemini model with long context"
            ),
            AIModel(
                name="gemini-1.5-flash",
                provider="gemini", 
                capabilities=["llm", "vlm"],
                max_tokens=8192,
                context_length=1048576,  # 1M tokens
                cost_per_1k_tokens=0.01,
                description="Fast and efficient Gemini model (default)"
            ),
            AIModel(
                name="gemini-1.5-flash-8b",
                provider="gemini",
                capabilities=["llm", "vlm"],
                max_tokens=8192,
                context_length=1048576,
                cost_per_1k_tokens=0.005,
                description="Smaller, faster Gemini model"
            ),
            
            # Experimental Models (May be available)
            AIModel(
                name="gemini-2.0-flash-exp",
                provider="gemini",
                capabilities=["llm", "vlm"],
                max_tokens=8192,
                context_length=1048576,
                cost_per_1k_tokens=0.01,
                description="Experimental next-generation Gemini model"
            ),
            AIModel(
                name="gemini-exp-1206",
                provider="gemini",
                capabilities=["llm", "vlm"], 
                max_tokens=8192,
                context_length=2097152,
                cost_per_1k_tokens=0.02,
                description="Experimental advanced Gemini model"
            )
        ]
    
    async def health_check(self) -> Dict[str, Any]:
        """Check Gemini API health"""
        if not self.is_available():
            return {"status": "unavailable", "reason": "No API key"}
        
        try:
            # Test with a simple request
            async with httpx.AsyncClient(timeout=10.0) as client:
                url = "{}/models/gemini-1.5-flash:generateContent".format(self.base_url)
                params = {"key": self.api_key}
                
                payload = {
                    "contents": [{
                        "parts": [{"text": "Hello"}]
                    }],
                    "generationConfig": {
                        "maxOutputTokens": 10
                    }
                }
                
                response = await client.post(url, params=params, json=payload)
                
                if response.status_code == 200:
                    return {"status": "healthy", "api_accessible": True}
                else:
                    return {"status": "unhealthy", "error": "API returned {}".format(response.status_code)}
                    
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}
    
    def get_available_models(self) -> List[AIModel]:
        """Get available Gemini models"""
        return self._models
    
    def get_models_by_capability(self, capability: str) -> List[AIModel]:
        """Get models that support specific capability"""
        return [model for model in self._models if capability in model.capabilities]
    
    # LLM Implementation
    async def analyze_intent(
        self, 
        transcript: str, 
        ui_tree: Optional[str] = None,
        model: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Analyze intent using Gemini"""
        if not self.is_available():
            raise ProviderUnavailableError("Gemini API key not available", "gemini")
        
        model = model or "gemini-1.5-flash"
        
        system_prompt = """AURA Android assistant. Analyze voice commands FAST.

TASK TYPES & KEYWORDS:
• Navigation: "open X", "go back", "home", "switch to X" → "navigate|open_app"
• Touch: "tap X", "click X", "press X" → "tap"
• Input: "type X", "enter X", "input X" → "type"
• Scroll: "scroll up/down", "swipe left/right" → "scroll|swipe"  
• System: "wifi on/off", "volume up/down", "brightness", "settings" → "system_command"
• Read: "what's on screen", "read this", "describe X" → "read_screen"

OUTPUT THIS EXACT JSON (no explanations):
{
    "intent": "clear 1-sentence goal",
    "action_type": "tap|swipe|type|scroll|navigate|open_app|system_command|read_screen",
    "requires_screen_analysis": true,
    "confidence": 0.8
}

BE ACCURATE and CONCISE."""
        
        user_prompt = "Command: '{}'".format(transcript)
        if ui_tree:
            # Truncate UI context more aggressively for speed while keeping essential info
            ui_context = ui_tree[:800] + "..." if len(ui_tree) > 800 else ui_tree
            user_prompt += "
UI Elements: {}".format(ui_context)
        
        try:
            response = await self.chat_completion(
                messages=[
                    {"role": "user", "content": "{}

{}".format(system_prompt, user_prompt)}
                ],
                model=model,
                temperature=0.0,    # Zero temperature for consistent results
                max_tokens=200,     # Reduced for faster response
                **kwargs
            )
            
            if response.get("success"):
                content = response["content"]
                try:
                    # Extract JSON from response if it's wrapped in markdown
                    if "```json" in content:
                        json_start = content.find("```json") + 7
                        json_end = content.find("```", json_start)
                        content = content[json_start:json_end].strip()
                    elif "```" in content:
                        json_start = content.find("```") + 3
                        json_end = content.find("```", json_start)
                        content = content[json_start:json_end].strip()
                    
                    intent_data = json.loads(content)
                    logger.info("Gemini LLM: Intent analyzed - {}".format(intent_data.get('intent', 'Unknown')))
                    return intent_data
                except json.JSONDecodeError:
                    logger.warning("Gemini LLM: Failed to parse JSON response")
                    return {
                        "intent": content,
                        "requires_screen_analysis": True,
                        "action_type": "tap",
                        "confidence": 0.5
                    }
            else:
                return {"error": response.get("error", "LLM request failed")}
                
        except Exception as e:
            logger.error("Gemini LLM Exception: {}".format(str(e)))
            return {"error": str(e)}
    
    async def generate_response(
        self, 
        prompt: str,
        model: Optional[str] = None,
        temperature: float = 0.1,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> Optional[str]:
        """Generate text response using Gemini"""
        try:
            response = await self.chat_completion(
                messages=[{"role": "user", "content": prompt}],
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
                **kwargs
            )
            
            if response.get("success"):
                return response["content"]
            else:
                logger.error("Gemini response generation failed: {}".format(response.get('error')))
                return None
                
        except Exception as e:
            logger.error("Gemini response generation exception: {}".format(str(e)))
            return None
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Chat completion with Gemini"""
        if not self.is_available():
            raise ProviderUnavailableError("Gemini API key not available", "gemini")
        
        model = model or "gemini-1.5-flash"
        
        try:
            # Convert messages to Gemini format
            contents = []
            for message in messages:
                role = "user"  # Gemini uses "user" and "model" roles
                if message["role"] == "assistant":
                    role = "model"
                
                content = message["content"]
                if isinstance(content, str):
                    contents.append({
                        "role": role,
                        "parts": [{"text": content}]
                    })
                elif isinstance(content, list):
                    # Handle multimodal content
                    parts = []
                    for part in content:
                        if part["type"] == "text":
                            parts.append({"text": part["text"]})
                        elif part["type"] == "image_url":
                            # Extract base64 data
                            image_url = part["image_url"]["url"]
                            if "base64," in image_url:
                                mime_type, base64_data = image_url.split("base64,", 1)
                                mime_type = mime_type.split(":")[1].split(";")[0]
                                parts.append({
                                    "inline_data": {
                                        "mime_type": mime_type,
                                        "data": base64_data
                                    }
                                })
                    contents.append({
                        "role": role,
                        "parts": parts
                    })
            
            # Prepare payload
            payload = {
                "contents": contents,
                "generationConfig": {
                    "temperature": kwargs.get("temperature", 0.1),
                    "maxOutputTokens": kwargs.get("max_tokens", 1000),
                    "topP": kwargs.get("top_p", 0.8),
                    "topK": kwargs.get("top_k", 40)
                }
            }
            
            # Add safety settings
            payload["safetySettings"] = [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
            ]
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = "{}/models/{}:generateContent".format(self.base_url, model)
                params = {"key": self.api_key}
                
                logger.info("Gemini LLM: Chat completion with model {}".format(model))
                response = await client.post(url, params=params, json=payload)
                
                if response.status_code == 200:
                    result = response.json()
                    if "candidates" in result and result["candidates"]:
                        content = result["candidates"][0]["content"]["parts"][0]["text"]
                        return {"success": True, "content": content, "model": model}
                    else:
                        error_msg = "No response generated"
                        if "promptFeedback" in result:
                            error_msg = "Content filtered: {}".format(result['promptFeedback'])
                        return {"success": False, "error": error_msg}
                elif response.status_code == 429:
                    raise RateLimitError("Rate limit exceeded", "gemini")
                elif response.status_code == 400:
                    error_data = response.json()
                    error_msg = error_data.get("error", {}).get("message", "Bad request")
                    return {"success": False, "error": "Gemini API error: {}".format(error_msg)}
                else:
                    error_msg = "API error: {}".format(response.status_code)
                    logger.error("Gemini LLM Error: {} - {}".format(error_msg, response.text))
                    return {"success": False, "error": error_msg}
                    
        except asyncio.TimeoutError:
            return {"success": False, "error": "Request timeout"}
        except Exception as e:
            logger.error("Gemini LLM Exception: {}".format(str(e)))
            return {"success": False, "error": str(e)}
    
    # VLM Implementation
    async def locate_ui_element(
        self, 
        screenshot: bytes, 
        intent: str,
        model: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Locate UI elements using Gemini Vision"""
        if not self.is_available():
            raise ProviderUnavailableError("Gemini API key not available", "gemini")
        
        model = model or "gemini-1.5-flash"
        
        try:
            image_b64 = base64.b64encode(screenshot).decode('utf-8')
        except Exception as e:
            return {"found": False, "error": "Image encoding failed: {}".format(str(e))}
        
        prompt = 'You are a UI element locator. Analyze the screenshot and find the UI element that matches this intent: "{}"

Look for buttons, text fields, icons, or other interactive elements. If you find a matching element, provide its pixel coordinates.

Return your response in this exact JSON format:
{{
    "found": true/false,
    "coordinates": {{"x": int, "y": int, "width": int, "height": int}},
    "confidence": 0.0-1.0,
    "element_description": "what you found",
    "reasoning": "why you chose this element"
}}

If you cannot find a matching element, set "found" to false and explain why.'.format(intent)
        
        try:
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": "data:image/png;base64,{}".format(image_b64)
                            }
                        }
                    ]
                }
            ]
            
            response = await self.chat_completion(
                messages=messages,
                model=model,
                temperature=0.1,
                max_tokens=500
            )
            
            if response.get("success"):
                content = response["content"]
                try:
                    # Extract JSON from response
                    if "```json" in content:
                        json_start = content.find("```json") + 7
                        json_end = content.find("```", json_start)
                        content = content[json_start:json_end].strip()
                    elif "```" in content:
                        json_start = content.find("```") + 3
                        json_end = content.find("```", json_start)
                        content = content[json_start:json_end].strip()
                    
                    vlm_result = json.loads(content)
                    if vlm_result.get("found"):
                        logger.info("Gemini VLM: Found UI element - {}".format(vlm_result.get('element_description', 'Unknown')))
                    else:
                        logger.warning("Gemini VLM: No matching UI element found")
                    return vlm_result
                except json.JSONDecodeError:
                    return {"found": False, "error": "Could not parse VLM response"}
            else:
                return {"found": False, "error": response.get("error", "VLM request failed")}
                
        except Exception as e:
            logger.error("Gemini VLM Exception: {}".format(str(e)))
            return {"found": False, "error": str(e)}
    
    async def analyze_screen_context(
        self, 
        screenshot: bytes,
        model: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Analyze screen context using Gemini Vision"""
        if not self.is_available():
            return {"error": "Gemini API key not available"}
        
        model = model or "gemini-1.5-flash"
        
        try:
            image_b64 = base64.b64encode(screenshot).decode('utf-8')
            
            prompt = """Analyze this Android screenshot and describe what you see. Return your analysis in this JSON format:

{
    "app_name": "detected app name",
    "screen_type": "main/settings/dialog/etc",
    "ui_elements": ["list of visible UI elements"],
    "suggestions": ["possible actions user can take"]
}

Look for app indicators, navigation elements, buttons, text fields, and other interactive components."""
            
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": "data:image/png;base64,{}".format(image_b64)
                            }
                        }
                    ]
                }
            ]
            
            response = await self.chat_completion(
                messages=messages,
                model=model,
                temperature=0.2,
                max_tokens=300
            )
            
            if response.get("success"):
                content = response["content"]
                try:
                    # Extract JSON from response
                    if "```json" in content:
                        json_start = content.find("```json") + 7
                        json_end = content.find("```", json_start)
                        content = content[json_start:json_end].strip()
                    elif "```" in content:
                        json_start = content.find("```") + 3
                        json_end = content.find("```", json_start)
                        content = content[json_start:json_end].strip()
                    
                    return json.loads(content)
                except json.JSONDecodeError:
                    return {"screen_analysis": content}
            else:
                return {"error": response.get("error", "Screen analysis failed")}
                
        except Exception as e:
            logger.error("Gemini screen analysis error: {}".format(str(e)))
            return {"error": str(e)}
    
    async def describe_image(
        self, 
        image_data: bytes,
        prompt: Optional[str] = None,
        model: Optional[str] = None,
        **kwargs
    ) -> Optional[str]:
        """Describe image using Gemini Vision"""
        try:
            image_b64 = base64.b64encode(image_data).decode('utf-8')
            
            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt or "Describe this image in detail"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": "data:image/png;base64,{}".format(image_b64)
                            }
                        }
                    ]
                }
            ]
            
            response = await self.chat_completion(
                messages=messages,
                model=model or "gemini-1.5-flash",
                **kwargs
            )
            
            if response.get("success"):
                return response["content"]
            else:
                return None
                
        except Exception as e:
            logger.error("Gemini image description error: {}".format(str(e)))
            return None

# Note: Gemini doesn't provide STT/TTS services
# These would need to be implemented by other providers or raise NotImplementedError
