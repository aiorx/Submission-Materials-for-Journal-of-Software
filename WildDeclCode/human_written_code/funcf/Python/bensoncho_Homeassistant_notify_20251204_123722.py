```python
def get_service(hass, config, discovery_info=None):
    """Get the Line notification service."""
    access_token = config.get(CONF_ACCESS_TOKEN )
    return DropboxNotificationService(access_token)
```