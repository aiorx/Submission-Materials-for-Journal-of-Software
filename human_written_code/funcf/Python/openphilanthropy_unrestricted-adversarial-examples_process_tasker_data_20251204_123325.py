```python
def _long_id_to_label_and_image_id(image_id):
  if image_id.startswith('/bird/'):
    return 'bird', image_id[len('/bird/'):-len('.jpg')]
  if image_id.startswith('/bicycle/'):
    return 'bicycle', image_id[len('/bicycle/'):-len('.jpg')]
  else:
    raise ValueError("Bad long_image_id: %s" % image_id)
```