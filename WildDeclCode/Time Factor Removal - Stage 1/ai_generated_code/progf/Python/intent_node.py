# Assisted using common GitHub development utilities
from ai_services import llm_service
from optimized_intent_analyzer import optimized_intent_analyzer
import logging
import time
import traceback
import json
import os

logger = logging.getLogger(__name__)

class IntentNode:
    """Optimized Intent analysis node using advanced prompt templates"""
    
    def __init__(self):
        self.name = "intent"

    async def run(self, state: dict) -> dict:
        """Analyze user intent from transcript with optimized processing"""
        start_time = time.time()
        logger.info("🎯 Intent Node: Starting optimized intent analysis")
        logger.info("🎯 Intent Node: Input state keys: {}".format(list(state.keys()))       logger.info("🎯 Intent Node: Transcript: '{}'".format(state.get('transcript', 'None'))       
        try:
            # Check if transcript is available
            transcript = state.get("transcript")
            if not transcript:
                logger.error("❌ Intent Node: No transcript available")
                return {
                    **state,
                    "error": "No transcript available for intent analysis",
                    "node_execution_times": {
                        **state.get("node_execution_times", {}),
                        self.name: time.time() - start_time
                    }
                }
                
            logger.info("🎯 Intent Node: Processing transcript: '{}'".format(transcript)           
            # Use optimized intent analyzer
            try:
                intent_result = await optimized_intent_analyzer.analyze_intent_optimized(
                    transcript=transcript,
                    ui_tree=state.get("ui_tree"),
                    llm_service=llm_service
                )
                
                logger.info("🎯 Intent Node: Optimized analysis result: {}".format(json.dumps(intent_result, indent=2))               
            except Exception as opt_error:
                logger.warning("🎯 Intent Node: Optimized analysis failed: {}, falling back to standard".format(opt_error)               
                # Fallback to standard LLM analysis
                prefs = state.get("provider_preferences", {}).get("llm", {})
                provider = prefs.get("provider") or os.getenv("LLM_PROVIDER", None)
                model = prefs.get("model") or os.getenv("LLM_MODEL", None)
                
                intent_result = await llm_service.analyze_intent(
                    transcript, 
                    state.get("ui_tree"),
                    provider=provider,
                    model=model
                )
            
            # Check for API errors
            if "error" in intent_result:
                logger.error("❌ Intent Node: Analysis error - {}".format(intent_result['error'])                return {
                    **state,
                    "error": intent_result["error"],
                    "node_execution_times": {
                        **state.get("node_execution_times", {}),
                        self.name: time.time() - start_time
                    }
                }
                
            # Extract intent information
            intent = intent_result.get("intent", "Unknown intent")
            requires_screen_analysis = intent_result.get("requires_screen_analysis", True)
            
            # Log analysis results with timing
            analysis_time = time.time() - start_time
            model_used = intent_result.get("_model_used", "standard")
            category = intent_result.get("_category", "general")
            
            logger.info("✅ Intent Node: Intent analyzed in {:.3f}s - '{}'".format(analysis_time, intent)
            logger.info("✅ Intent Node: Category: {}, Model: {}".format(category, model_used)            logger.info("✅ Intent Node: Requires screen analysis - {}".format(requires_screen_analysis)            
            result_state = {
                **state,
                "intent": intent,
                "intent_data": intent_result,
                "use_vlm": requires_screen_analysis,
                "node_execution_times": {
                    **state.get("node_execution_times", {}),
                    self.name: analysis_time
                }
            }
            
            logger.info("✅ Intent Node: Output state keys: {}".format(list(result_state.keys()))            return result_state
            
        except Exception as e:
            error_trace = traceback.format_exc()
            logger.error("❌ Intent Node error: {}".format(str(e))            logger.error("❌ Intent Node traceback: {}".format(error_trace)            return {
                **state,
                "error": "Intent analysis failed: {}".format(str(e)),
                "node_execution_times": {
                    **state.get("node_execution_times", {}),
                    self.name: time.time() - start_time
                }
            }# Global instance
intent_node = IntentNode()
# Create node instance
intent_node = IntentNode()
