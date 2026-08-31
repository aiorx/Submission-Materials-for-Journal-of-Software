def execute_query_code(code, filename):
    """
    Runs the Routine programming code snippets on the df.
    """
    file_path = os.path.join("./temp", filename)

    df = load_dataframe(file_path)

    sanitize_code(code)

    local_vars = {'df': df}

    try:
        result = eval(code, {"__builtins__": {}}, local_vars)
    except Exception as e:
        result = f"Error executing code: {str(e)}"

    return result