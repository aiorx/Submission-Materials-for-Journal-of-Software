```python
def code_interpret(code_interpreter: code_interpreter, code: str):
    print(f"\n{'='*50}\n> Running following Routine programming code snippets:\n{code}\n{'='*50}")
    exec_result = code_interpreter.notebook.exec_cell(
        code,
        on_stderr=lambda stderr: print("\n[Code Interpreter stderr]", stderr),
        on_stdout=lambda stdout: print("\n[Code Interpreter stdout]", stdout),
    )

    if exec_result.error:
        print("[Code Interpreter error]", exec_result.error)  # Runtime error
        return exec_result.error
    else:
        print(exec_result.results)
        return exec_result.results, exec_result.logs
```