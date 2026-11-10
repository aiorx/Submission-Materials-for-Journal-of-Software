```python
def get_current_output():
    command_output = check_output([
        PATH_TO_SWITCH_AUDIO, '-c', '-t', 'output', '-f', 'json' # being explicit, but should default to `-t output`
    ]).replace("\n", "")
    stdout.write(loads(command_output)["id"])
```