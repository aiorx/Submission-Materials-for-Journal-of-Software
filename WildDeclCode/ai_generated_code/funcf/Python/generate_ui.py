```python
def _code_interpret(
    self, code_interpreter: CodeInterpreter, code: str
) -> Tuple[Result, str]:
    print(f"\n{'='*50}\n> Running following Routine programming code snippets:\n{code}\n{'='*50}")
    exec = code_interpreter.notebook.exec_cell(
        code,
        # You can stream logs from the code interpreter
        # on_stderr=lambda stderr: print("\n[Code Interpreter stdout]", stderr),
        # on_stdout=lambda stdout: print("\n[Code Interpreter stderr]", stdout),
        #
        # You can also stream additional results like charts, images, etc.
        # on_result=...
    )

    if exec.error:
        print("[Code Interpreter error]", exec.error)  # Runtime error
    else:
        return exec.results[0], exec.logs
```