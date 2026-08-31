```python
def __init__(self, threshold: float = 0.1):
    """
    Base code Assisted with basic coding tools. Conversation history: https://chatgpt.com/share/673c8c6e-6f90-800f-bdaa-4767b688f923

    Args:
        threshold (float): Minimim correlation. The correlation threshold below which columns will be dropped.
    """
    assert 0 <= threshold <= 1, "Threshold must be a float between 0 and 1."
    self.threshold = threshold
    self.dropped_columns = []
```