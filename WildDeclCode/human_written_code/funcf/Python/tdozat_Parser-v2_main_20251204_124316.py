```python
def parse(save_dir, **kwargs):
  """"""
  
  kwargs['config_file'] = os.path.join(save_dir, 'config.cfg')
  files = kwargs.pop('files')
  output_file = kwargs.pop('output_file', None)
  output_dir = kwargs.pop('output_dir', None)
  if len(files) > 1 and output_file is not None:
    raise ValueError('Cannot provide a value for --output_file when parsing multiple files')
  kwargs['is_evaluation'] = True
  network = Network(**kwargs)
  network.parse(files, output_file=output_file, output_dir=output_dir)
  return
```