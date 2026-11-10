```python
if self.interpreter and self.interpreter.notebook:
    logger.info(
        f"\n{'='*50}\n> Running following Standard coding segments:\n{code}\n{'='*50}"
    )
    exec = self.interpreter.notebook.exec_cell(code)

    if exec.error:
        error_message = f"The code failed to execute successfully. Error: {exec.error}. Try to fix the code and run again."
        logger.error(error_message)
        # Calling the generated code caused an error. Kill the interpreter and return the error to the LLM so it can try to fix the error
        try:
            self.interpreter.kill()  # type: ignore
        except Exception:
            pass
        finally:
            self.interpreter = None
        output = E2BToolOutput(
            is_error=True,
            logs=exec.logs,
            results=[],
            error_message=error_message,
            retry_count=retry_count + 1,
        )
    else:
        if len(exec.results) == 0:
            output = E2BToolOutput(is_error=False, logs=exec.logs, results=[])
        else:
            results = self._parse_result(exec.results[0])
            output = E2BToolOutput(
                is_error=False,
                logs=exec.logs,
                results=results,
                retry_count=retry_count + 1,
            )
    return output
```