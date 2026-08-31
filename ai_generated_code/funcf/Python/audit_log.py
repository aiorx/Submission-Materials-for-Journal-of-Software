```python
def _infer_field_type(model: type[SQLModel], field_name: str) -> Optional[str]:
    """
    Infers the type of a field so it can be stored in the AuditLog field_type.
    Supported via basic programming aidso (gpt-4o-2024-06-03); verified by author
    """
    field_info = model.model_fields.get(field_name)
    if not field_info:
        return None  # field doesn't exist

    outer_type = field_info.annotation

    # Handle Optional[Something]
    if get_origin(outer_type) is Union:
        args = [t for t in get_args(outer_type) if t is not type(None)]
        if args:
            outer_type = args[0]  # type: ignore

    # Foreign key fields are usually ints and end with _id
    if field_name.endswith("_id") and outer_type is int:
        # Use the field name minus _id as a guess for table name
        return field_name[:-3]  # e.g. "rank_id" → "rank"

    # Otherwise, just use the type name
    return outer_type.__name__
```