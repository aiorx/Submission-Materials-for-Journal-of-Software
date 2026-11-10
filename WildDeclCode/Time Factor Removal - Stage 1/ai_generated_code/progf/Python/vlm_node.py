# Supported via standard GitHub programming aids
from ai_services import vlm_service
from optimized_vlm_analyzer import optimized_vlm_analyzer
import logging
import time
import os

logger = logging.getLogger(__name__)

class VLMNode:
    """Optimized Vision-Language Model node for UI element detection"""
    
    def __init__(self):
        self.name = "vlm"
    
    async def run(self, state: dict) -> dict:
        """Use optimized VLM to locate UI elements on screen"""
        start_time = time.time()
        logger.info("🔍 VLM Node: Starting optimized vision-language model analysis")
        
        screenshot = state.get("_screenshot_bytes")
        intent = state.get("intent", "")
        intent_data = state.get("intent_data", {})
        action_type = intent_data.get("action_type", "")
        
        # Check if screenshot is available
        if not screenshot:
            logger.error("❌ VLM Node: No screenshot data available")
            return {
                **state,
                "error": "No screenshot data available for VLM analysis",
                "node_execution_times": {
                    **state.get("node_execution_times", {}),
                    self.name: time.time() - start_time
                }
            }
            
        try:
            # Use optimized VLM analyzer
            try:
                vlm_result = await optimized_vlm_analyzer.analyze_screenshot_optimized(
                    screenshot_bytes=screenshot,
                    intent=intent,
                    action_type=action_type,
                    vlm_service=vlm_service
                )
                
                logger.info("🔍 VLM Node: Optimized analysis result: {}".format(vlm_result)               
            except Exception as opt_error:
                logger.warning("🔍 VLM Node: Optimized analysis failed: {}, falling back to standard".format(opt_error)               
                # Fallback to standard VLM analysis
                prefs = state.get("provider_preferences", {}).get("vlm", {})
                provider = prefs.get("provider") or os.getenv("VLM_PROVIDER", None)
                model = prefs.get("model") or os.getenv("VLM_MODEL", None)
                
                # Enable auto mode if no specific provider/model specified
                auto_mode = not provider and not model
                performance_mode = prefs.get("performance_mode", "balanced")
                cost_sensitive = prefs.get("cost_sensitive", True)
                
                vlm_result = await vlm_service.locate_ui_element(
                    screenshot, 
                    intent,
                    provider=provider,
                    model=model,
                    auto_mode=auto_mode,
                    performance_mode=performance_mode,
                    cost_sensitive=cost_sensitive
                )
            
            analysis_time = time.time() - start_time
            model_used = vlm_result.get("_model_used", "standard")
            task_type = vlm_result.get("_task_type", "general")
            
            logger.info("✅ VLM Node: Analysis completed in {:.3f}s".format(analysis_time)
            logger.info("✅ VLM Node: Task: {}, Model: {}".format(task_type, model_used)            logger.info("✅ VLM Node: Found: {}, Confidence: {:.2f}".format(vlm_result.get('found', False), vlm_result.get('confidence', 0))")
            
            return {
                **state,
                "vlm_result": vlm_result,
                "node_execution_times": {
                    **state.get("node_execution_times", {}),
                    self.name: analysis_time
                }
            }
            
        except Exception as e:
            logger.error("❌ VLM Node error: {}".format(str(e))            return {
                **state,
                "error": "VLM analysis failed: {}".format(str(e)),
                "node_execution_times": {
                    **state.get("node_execution_times", {}),
                    self.name: time.time() - start_time
                }
            }

# Create node instance
vlm_node = VLMNode()
