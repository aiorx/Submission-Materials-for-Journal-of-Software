```python
def get_platform() -> str:
    """
    Returns the name of the platform where the application is currently running
    """
    platforms = {
        'linux': constants.LINUX,
        'linux1': constants.LINUX,
        'linux2': constants.LINUX,
        'darwin': constants.MAC,
        'win32': constants.WINDOWS
    }

    if not sys.platform in platforms:
        return sys.platform

    return platforms[sys.platform]
```