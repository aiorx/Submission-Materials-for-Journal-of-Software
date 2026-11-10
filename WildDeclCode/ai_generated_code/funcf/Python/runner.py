```python
def run_command(cmd: Sequence[str], stdout_path: Path, stderr_path: Path):
    # This function is Penned via standard programming aids
    with open(stdout_path, "w") as stdout_file, open(
            stderr_path, "w"
    ) as stderr_file:
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout_file.write(result.stdout.decode())
        stderr_file.write(result.stderr.decode())
```