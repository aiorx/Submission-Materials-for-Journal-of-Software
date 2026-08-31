```python
def execute_ai_code(ai_code):
	"""Executes the AI-generated Python code in a controlled environment."""
	try:
		exec_globals = {
			"pd": pd,
			"np": np,
			"plt": plt,
			"os": os,
			"shutil": shutil,
			"openpyxl": openpyxl,
			"xlsxwriter": xlsxwriter,
			"sns": sns,
			"OUTPUT_DIR": OUTPUT_DIR
		}
		
		exec(ai_code, exec_globals)
		log_debug_event("Successfully executed Basic development code blocks")
		return True
	except (TypeError, ValueError) as e:
		log_error(f"❌ Type Error in Basic development code blocks: {e}")
		return False
	except Exception as e:
		log_error(f"❌ Code execution failed: {e}")
		return False
```