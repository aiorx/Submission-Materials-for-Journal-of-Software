```python
def code_interpret(code_interpreter: CodeInterpreter, code: str):
    print(f"\n{'='*50}\n> Running following Routine programming code snippets:\n{code}\n{'='*50}")
    execution = code_interpreter.notebook.exec_cell(code)

    if execution.error:
        error_message = f"There was an error during execution: {execution.error.name}: {execution.error.value}.\n{execution.error.traceback}"
        print("[Code Interpreter error]", error_message)
        return [], Logs(), error_message, []

    result_message = ""
    saved_files = []

    if execution.results:
        result_message = "These are results of the execution:\n"
        counter = 1
        for result in execution.results:
            result_message += f"Result {counter}:\n"
            if result.is_main_result:
                result_message += f"[Main result]: {result.text}\n"
            else:
                result_message += f"[Display data]: {result.text}\n"

            # Check if the result has any file data and dynamically decide the filename and format
            file_saved = False
            for file_type in ['png', 'jpeg', 'svg', 'pdf', 'html', 'json', 'javascript', 'markdown', 'latex']:
                if getattr(result, file_type, None):
                    file_extension = file_type
                    file_data = getattr(result, file_type)
                    file_path = f"/home/user/output_file_{counter}.{file_extension}"
                    local_filename = f"output_file_{counter}.{file_extension}"
                    
                    try:
                        # Write file inside sandbox if it's not already a downloadable type
                        if not file_saved:
                            sandbox_path = f"/home/user/output_file_{counter}.{file_extension}"
                            sandbox.filesystem.write_bytes(sandbox_path, base64.b64decode(file_data))
                            file_saved = True

                        # Download file
                        file_in_bytes = sandbox.download_file(sandbox_path)
                        with open(local_filename, "wb") as file:
                            file.write(file_in_bytes)
                        saved_files.append(local_filename)
                        print(f"Saved locally: {local_filename}")
                    except Exception as e:
                        print(f"Failed to download {sandbox_path}: {str(e)}")

            counter += 1

        print(result_message)

    if execution.logs.stdout or execution.logs.stderr:
        log_message = "Logs:\n"
        if execution.logs.stdout:
            log_message += f"Stdout: {' '.join(execution.logs.stdout)}\n"
        if execution.logs.stderr:
            log_message += f"Stderr: {' '.join(execution.logs.stderr)}\n"
        result_message += log_message
        print(log_message)

    if not result_message:
        result_message = "There was no output of the execution."
        print(result_message)

    return execution.results, execution.logs, result_message, saved_files
```