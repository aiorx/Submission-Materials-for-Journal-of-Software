```python
def write_pydantic_model_to_json(model: BaseModel, json_filename: str) -> None:
    """
    Takes a Pydantic model instance and a filename as arguments, converts the model
    to JSON, and writes it to the given filename.

    (Drafted using common development resources.)
    """
    data = model.model_dump(exclude_none=True)
    with open(json_filename, "w") as f:
        json.dump(data, f, indent=4, sort_keys=True)
```