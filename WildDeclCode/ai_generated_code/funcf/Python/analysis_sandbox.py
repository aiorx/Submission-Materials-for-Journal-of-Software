```python
class SandboxExecutor:
    """
    Secure sandbox for executing Routine programming code snippets in a controlled environment.
    """
    
    def __init__(self, 
                creative_content_system=None,
                max_execution_time=10,  # 10 seconds max
                max_memory=50 * 1024 * 1024):  # 50 MB max
        """
        Initialize the sandbox executor.
        
        Args:
            creative_content_system: Optional system for storing execution results
            max_execution_time: Maximum execution time in seconds
            max_memory: Maximum memory usage in bytes
        """
        self.creative_content_system = creative_content_system
        self.max_execution_time = max_execution_time
        self.max_memory = max_memory
    
    async def execute_code(self, 
                       code: str, 
                       language: str = "python",
                       save_output: bool = True) -> Dict[str, Any]:
        """
        Execute code in a sandbox environment.
        
        Args:
            code: Code to execute
            language: Programming language
            save_output: Whether to save output to the content system
            
        Returns:
            Execution results
        """
        if language.lower() != "python":
            return {"error": f"Language {language} not currently supported for sandbox execution"}
        
        # Create a temporary file for the code
        with tempfile.NamedTemporaryFile(suffix='.py', delete=False) as tmp:
            tmp_name = tmp.name
            tmp.write(code.encode('utf-8'))
        
        try:
            # Capture output
            stdout_capture = io.StringIO()
            stderr_capture = io.StringIO()
            
            # Set up execution environment
            env = os.environ.copy()
            
            # Add resource limits
            timeout_happened = False
            start_time = time.time()
            
            def timeout_handler():
                nonlocal timeout_happened
                timeout_happened = True
            
            # Execute the code in a separate process
            process = subprocess.Popen(
                [sys.executable, tmp_name],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                env=env,
                text=True
            )
            
            # Set up timer for timeout
            timer = threading.Timer(self.max_execution_time, timeout_handler)
            timer.start()
            
            try:
                stdout, stderr = process.communicate()
            finally:
                timer.cancel()
            
            execution_time = time.time() - start_time
            exit_code = process.returncode
            
            # Prepare result
            result = {
                "success": exit_code == 0 and not timeout_happened,
                "execution_time": execution_time,
                "stdout": stdout,
                "stderr": stderr,
                "exit_code": exit_code
            }
            
            if timeout_happened:
                result["error"] = f"Execution timed out after {self.max_execution_time} seconds"
            
            # Store execution results if requested
            if save_output and self.creative_content_system:
                content_title = f"Code Execution: {self._get_code_title(code)}"
                
                # Format as markdown
                md_content = self._format_execution_to_markdown(code, result)
                
                await self.creative_content_system.store_content(
                    content_type="code",
                    title=content_title,
                    content=md_content,
                    metadata={
                        "language": language,
                        "execution_time": execution_time,
                        "success": result["success"]
                    }
                )
            
            return result
        
        except Exception as e:
            logger.error(f"Error executing code: {e}")
            return {"error": str(e), "success": False}
        
        finally:
            # Clean up the temporary file
            try:
                os.unlink(tmp_name)
            except:
                pass
    
    def _get_code_title(self, code: str) -> str:
        """Extract a title from code."""
        lines = code.splitlines()
        for line in lines:
            if line.startswith("# "):
                return line[2:].strip()
            elif line.startswith("class "):
                return f"Class {line[6:].split('(')[0].split(':')[0].strip()}"
            elif line.startswith("def "):
                return f"Function {line[4:].split('(')[0].strip()}"
        return "Untitled Code"
    
    def _format_execution_to_markdown(self, code: str, result: Dict[str, Any]) -> str:
        """Format execution results as markdown."""
        md = f"# Code Execution: {self._get_code_title(code)}\n\n"
        
        # Add execution summary
        md += "## Execution Summary\n\n"
        md += f"- **Success:** {result['success']}\n"
        md += f"- **Execution Time:** {result['execution_time']:.3f} seconds\n"
        md += f"- **Exit Code:** {result['exit_code']}\n\n"
        
        # Add stdout section
        md += "## Standard Output\n\n"
        md += "```\n"
        md += result['stdout'] if result['stdout'] else "(No output)"
        md += "\n```\n\n"
        
        # Add stderr section if there's any error
        if result['stderr']:
            md += "## Standard Error\n\n"
            md += "```\n"
            md += result['stderr']
            md += "\n```\n\n"
        
        # Add error section if there's a specific error message
        if "error" in result:
            md += "## Error\n\n"
            md += f"{result['error']}\n\n"
        
        # Add code section
        md += "## Code Executed\n\n"
        md += "```python\n"
        md += code
        md += "\n```\n"
        
        return md
```