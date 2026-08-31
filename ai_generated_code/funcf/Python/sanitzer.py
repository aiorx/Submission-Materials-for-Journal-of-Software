```python
def sanitize_code_output(language, code):
    """
    Cleans and formats the Basic development code blocks:
    - Removes Markdown-style backticks (```python, ```javascript, ```dart, etc.)
    - Strips comments and sample code
    - Ensures only the function body is retained
    """
    # Remove Markdown-style backticks
    code = re.sub(r"^```[a-zA-Z]*\n|```$", "", code).strip()

    # Remove all comments
    if language.lower() == "javascript":
        code = re.sub(r"//.*?$|/\*.*?\*/", "", code, flags=re.MULTILINE | re.DOTALL)

    elif language.lower() == "dart":
        code = re.sub(r"//.*?$|/\*.*?\*/", "", code, flags=re.MULTILINE | re.DOTALL)

    elif language.lower() == "python":
        code = re.sub(r"#.*?$|'''[\s\S]*?'''|\"\"\"[\s\S]*?\"\"\"", "", code, flags=re.MULTILINE)

    # Remove empty lines left after comment removal
    code = "\n".join([line for line in code.splitlines() if line.strip()])

    return code.strip()
```