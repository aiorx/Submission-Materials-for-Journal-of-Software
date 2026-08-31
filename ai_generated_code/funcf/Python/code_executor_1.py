```python
class CodeExecutionSandbox:
    """
    A secure sandbox for executing Routine programming code snippets dynamically.
    Similar to AWS Lambda but runs locally with safety constraints.
    """
    
    def __init__(self, 
                 max_execution_time: int = 30,
                 max_memory_mb: int = 512,
                 allowed_imports: Optional[list] = None):
        """
        Initialize the code execution sandbox.
        
        Args:
            max_execution_time: Maximum execution time in seconds
            max_memory_mb: Maximum memory usage in MB
            allowed_imports: List of allowed module imports (None = default safe list)
        """
        self.max_execution_time = max_execution_time
        self.max_memory_mb = max_memory_mb
        self.allowed_imports = allowed_imports or [
            'math', 'random', 'datetime', 'json', 'collections',
            'itertools', 'functools', 'operator', 'string',
            're', 'statistics', 'decimal', 'fractions',
            'numpy', 'pandas', 'matplotlib', 'matplotlib.pyplot', 'seaborn'
        ]
        self.execution_history = []
    
    @contextmanager
    def _timeout(self, seconds):
        """Context manager for timing out code execution"""
        def signal_handler(signum, frame):
            raise TimeoutError(f"Code execution exceeded {seconds} seconds")
        
        # Set the signal handler and alarm
        signal.signal(signal.SIGALRM, signal_handler)
        signal.alarm(seconds)
        
        try:
            yield
        finally:
            signal.alarm(0)  # Disable the alarm
    
    def _validate_code(self, code: str) -> Tuple[bool, str]:
        """
        Validate code for safety before execution.
        
        Returns:
            Tuple of (is_safe, error_message)
        """
        try:
            tree = ast.parse(code)
            
            # Check for dangerous operations
            for node in ast.walk(tree):
                # Prevent file system operations
                if isinstance(node, ast.Name) and node.id in ['open', 'file']:
                    return False, "File operations are not allowed"
                
                # Prevent system calls
                if isinstance(node, ast.Attribute):
                    if hasattr(node.value, 'id') and node.value.id == 'os':
                        return False, "OS operations are not allowed"
                    if hasattr(node.value, 'id') and node.value.id == 'subprocess':
                        return False, "Subprocess operations are not allowed"
                
                # Prevent eval/exec
                if isinstance(node, ast.Name) and node.id in ['eval', 'exec', '__import__']:
                    return False, f"{node.id} is not allowed"
                
                # Check imports
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        if alias.name not in self.allowed_imports:
                            return False, f"Import '{alias.name}' is not allowed"
                
                if isinstance(node, ast.ImportFrom):
                    # Allow submodules of allowed packages
                    base_module = node.module.split('.')[0] if node.module else None
                    if base_module not in self.allowed_imports:
                        return False, f"Import from '{node.module}' is not allowed"
            
            return True, ""
            
        except SyntaxError as e:
            return False, f"Syntax error: {str(e)}"
        except Exception as e:
            return False, f"Validation error: {str(e)}"
    
    async def execute_code(self, 
                          code: str, 
                          context: Dict[str, Any] = None,
                          return_visualization: bool = False) -> Dict[str, Any]:
        """
        Execute Python code in a sandboxed environment.
        
        Args:
            code: Python code to execute
            context: Variables to inject into the execution context
            return_visualization: If True, capture matplotlib figures
            
        Returns:
            Dict containing execution results, output, errors, and optionally visualizations
        """
        execution_id = datetime.now().isoformat()
        
        # Validate code first
        is_safe, error_msg = self._validate_code(code)
        if not is_safe:
            return {
                "success": False,
                "error": f"Code validation failed: {error_msg}",
                "execution_id": execution_id
            }
        
        # Create a temporary file for the code
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            # Prepare the execution environment
            setup_code = """
import sys
import io
from contextlib import redirect_stdout, redirect_stderr
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt

# Capture stdout and stderr
stdout_capture = io.StringIO()
stderr_capture = io.StringIO()

# Result storage
_execution_result = None
_visualization_data = None

"""
            
            # Add context variables if provided
            if context:
                for key, value in context.items():
                    setup_code += f"{key} = {repr(value)}\n"
            
            # Wrap the user code
            wrapped_code = setup_code + f"""
# User code execution
try:
    with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
{chr(10).join('        ' + line for line in code.split(chr(10)))}
        
    # Capture any matplotlib figures
    if plt.get_fignums():
        import base64
        from io import BytesIO
        
        fig = plt.gcf()
        buffer = BytesIO()
        fig.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
        buffer.seek(0)
        _visualization_data = base64.b64encode(buffer.read()).decode('utf-8')
        plt.close('all')
        
except Exception as e:
    stderr_capture.write(f"Error: {{type(e).__name__}}: {{str(e)}}\\n")
    import traceback
    stderr_capture.write(traceback.format_exc())

# Store outputs
_stdout_output = stdout_capture.getvalue()
_stderr_output = stderr_capture.getvalue()

# Try to capture the last expression result
try:
    if 'result' in locals():
        _execution_result = result
    elif 'output' in locals():
        _execution_result = output
    elif 'data' in locals():
        _execution_result = data
except:
    pass

# Write results to a JSON file for safe transfer
import json
output_data = {{
    'stdout': _stdout_output,
    'stderr': _stderr_output,
    'result': str(_execution_result) if _execution_result is not None else None,
    'visualization': _visualization_data
}}

with open('{f.name}.output', 'w') as out_f:
    json.dump(output_data, out_f)
"""
            
            f.write(wrapped_code)
            f.flush()
            temp_file = f.name
        
        output_file = f"{temp_file}.output"
        
        try:
            # Execute the code with resource limits
            process = await asyncio.create_subprocess_exec(
                sys.executable, temp_file,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                preexec_fn=lambda: resource.setrlimit(
                    resource.RLIMIT_AS, 
                    (self.max_memory_mb * 1024 * 1024, self.max_memory_mb * 1024 * 1024)
                ) if sys.platform != 'darwin' else None  # Memory limits don't work well on macOS
            )
            
            # Wait for completion with timeout
            try:
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(), 
                    timeout=self.max_execution_time
                )
            except asyncio.TimeoutError:
                process.kill()
                await process.wait()
                return {
                    "success": False,
                    "error": f"Code execution timed out after {self.max_execution_time} seconds",
                    "execution_id": execution_id
                }
            
            # Read the output file
            if os.path.exists(output_file):
                with open(output_file, 'r') as f:
                    output_data = json.load(f)
                
                # Check if stderr only contains warnings (not errors)
                stderr_content = output_data.get('stderr', '')
                is_only_warnings = (
                    stderr_content == '' or 
                    ('UserWarning' in stderr_content and 'cannot be shown' in stderr_content and 'Error:' not in stderr_content)
                )
                
                result = {
                    "success": is_only_warnings,
                    "stdout": output_data.get('stdout', ''),
                    "stderr": output_data.get('stderr', ''),
                    "result": output_data.get('result'),
                    "execution_id": execution_id,
                    "execution_time": datetime.now().isoformat()
                }
                
                if return_visualization and output_data.get('visualization'):
                    result['visualization'] = {
                        'type': 'image',
                        'format': 'png',
                        'data': output_data['visualization']
                    }
                
                # Store in history
                self.execution_history.append({
                    'id': execution_id,
                    'code': code,
                    'result': result,
                    'timestamp': datetime.now()
                })
                
                return result
            else:
                # If output file doesn't exist, there was a critical error
                return {
                    "success": False,
                    "error": "Failed to capture execution output",
                    "stdout": stdout.decode() if stdout else "",
                    "stderr": stderr.decode() if stderr else "",
                    "execution_id": execution_id
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Execution error: {str(e)}",
                "execution_id": execution_id
            }
        finally:
            # Clean up temporary files
            for file in [temp_file, output_file]:
                if os.path.exists(file):
                    try:
                        os.unlink(file)
                    except:
                        pass
```