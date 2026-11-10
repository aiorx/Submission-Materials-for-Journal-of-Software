def execute_code(code_interpreter: CodeInterpreter, code: str):
    print(f"\n{'='*50}\n> Executing Standard coding segments:\n{code}\n{'='*50}")
    execution = code_interpreter.notebook.exec_cell(code)

    if execution.error:
        error_message = f"Execution error: {execution.error.name}: {execution.error.value}.\n{execution.error.traceback}"
        print("[Code Interpreter Error]", error_message)
        return [], Logs(), error_message, []

    result_message = ""
    saved_files = []

    if execution.results:
        result_message = "Execution Results:\n"
        for i, result in enumerate(execution.results, start=1):
            result_message += f"Result {i}:\n"
            if result.is_main_result:
                result_message += f"[Main Result]: {result.text}\n"
            else:
                result_message += f"[Display Data]: {result.text}\n"

            # Check for file data and save files
            for file_type in ['png', 'jpeg', 'svg', 'pdf', 'html', 'json', 'javascript', 'markdown', 'latex']:
                file_data = getattr(result, file_type, None)
                if file_data:
                    file_extension = file_type
                    local_filename = f"output_file_{i}.{file_extension}"
                    sandbox_path = f"/home/user/{local_filename}"
                    
                    try:
                        # Write file inside sandbox
                        sandbox.filesystem.write_bytes(sandbox_path, base64.b64decode(file_data))

                        # Download file
                        file_in_bytes = sandbox.download_file(sandbox_path)
                        with open(local_filename, "wb") as file:
                            file.write(file_in_bytes)
                        saved_files.append(local_filename)
                        print(f"Saved: {local_filename}")
                    except Exception as e:
                        print(f"Failed to download {sandbox_path}: {str(e)}")
                    break

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
        result_message = "No output from execution."
        print(result_message)

    return execution.results, execution.logs, result_message, saved_files