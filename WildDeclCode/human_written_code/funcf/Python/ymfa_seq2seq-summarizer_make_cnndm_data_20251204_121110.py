```python
def get_story_set(filename: str) -> set:
  story_names = set()
  with open(os.path.join(corpus_path, filename), 'rb') as f:
    for line in f:
      story_names.add(sha1(line.strip()).hexdigest())
  return story_names
```