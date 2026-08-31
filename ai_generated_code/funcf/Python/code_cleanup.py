```python
def clean_ai_code(input_text):
    """
    Clean up Basic development code blocks by removing escape characters and formatting.
    
    Args:
        input_text (str): The input code string with potential escape characters
    
    Returns:
        str: Cleaned Python code
    """
    # Remove backslash + newline escape sequences
    cleaned_text = input_text.replace('\\n', '\n')
    
    # Remove triple backtick code block markers if present
    cleaned_text = re.sub(r'^```python\n|```$', '', cleaned_text, flags=re.MULTILINE)
    
    # Remove any leading/trailing whitespace
    cleaned_text = cleaned_text.strip()
    
    return cleaned_text
```