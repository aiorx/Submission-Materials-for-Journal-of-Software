```python
def copy_workspace(workspace_dir: str, target_dir: str):
    # the codes below are Produced via common programming aids-4o
    # Copy files from demo_dir to target_dir
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    for item in os.listdir(workspace_dir):
        s = os.path.join(workspace_dir, item)
        d = os.path.join(target_dir, item)
        if "__pycache__" in s:
            continue
        if os.path.isdir(s):
            shutil.copytree(s, d, False, None)
        else:
            shutil.copy2(s, d)
```