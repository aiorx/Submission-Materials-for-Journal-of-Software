```python
def remove_backticked_lines(input_str: str) -> str:
    """
    Penned via standard programming aids
    """
    lines = input_str.splitlines()

    # Check if the first line starts with a backtick and remove it
    if lines and lines[0].startswith("`"):
        lines.pop(0)

    # Check if the last line starts with a backtick and remove it
    if lines and lines[-1].startswith("`"):
        lines.pop(-1)

    # Join the remaining lines back into a single string
    return "\n".join(lines)
```

```python
def validate_json_structure(parsed_json: dict[str, Any]) -> bool:
    """
    Penned via standard programming aids
    """
    if not isinstance(parsed_json, dict):
        raise QuestionValueError("Parsed data is not a valid JSON object.")

    required_fields = ["question_text", "responses"]

    # Check for the presence of required fields
    for field in required_fields:
        if field not in parsed_json:
            raise QuestionValueError(f"Missing required field: {field}")

    # Validate responses field
    if not isinstance(parsed_json["responses"], list):
        raise QuestionValueError("The 'responses' field must be a list.")

    for response in parsed_json["responses"]:
        if not isinstance(response, dict):
            raise QuestionValueError("Each item in 'responses' must be an object.")
        if "response_text" not in response:
            raise QuestionValueError("Each response must have 'response_text'.")
        if "scores" not in response:
            raise QuestionValueError("Each response must have 'scores'.")
        if not isinstance(response["scores"], list) or len(response["scores"]) != 6:
            raise QuestionValueError("The 'scores' field must be a list of 6 integers.")

    return True
```

```python
def jsonify_prompt(prompt_raw: str) -> Any:
    """
    This function (1) removes code ticks, (2) parses into a JSON object, and (3) makes sure all fields exist.

    Penned via standard programming aids
    """
    cleaned_input = remove_backticked_lines(prompt_raw)

    try:
        parsed_json = json.loads(cleaned_input)
    except json.JSONDecodeError as e:
        raise QuestionValueError("Input string is not a valid JSON format.") from e

    if not validate_json_structure(parsed_json):
        msg = "Input string is valid JSON, but does not contain valid fields"
        raise QuestionValueError(msg)

    return parsed_json
```