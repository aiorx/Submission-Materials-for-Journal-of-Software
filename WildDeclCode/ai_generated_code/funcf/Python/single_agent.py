```python
def code_interpret(code: str):
    """
    A function to demonstrate running Python code dynamically using e2b_code_interpreter.
    """
    print(f"\n{'='*50}\n> Running following Routine programming code snippets:\n{code}\n{'='*50}")
    exec_result = Sandbox().run_code(code)
    if exec_result.error:
        print("[Code Interpreter error]", exec_result.error)
        return {"error": str(exec_result.error)}
    else:
        results = []
        for result in exec_result.results:
            if hasattr(result, '__iter__'):
                results.extend(list(result))
            else:
                results.append(str(result))
        logs = {"stdout": list(exec_result.logs.stdout), "stderr": list(exec_result.logs.stderr)}
        return json.dumps({"results": results, "logs": logs})
```