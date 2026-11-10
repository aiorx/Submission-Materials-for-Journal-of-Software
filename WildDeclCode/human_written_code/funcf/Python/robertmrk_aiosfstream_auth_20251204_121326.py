```python
@property
def _token_url(self) -> str:
    """The URL that should be used for token requests"""
    if self._sandbox:
        return SANDBOX_TOKEN_URL
    return TOKEN_URL
```