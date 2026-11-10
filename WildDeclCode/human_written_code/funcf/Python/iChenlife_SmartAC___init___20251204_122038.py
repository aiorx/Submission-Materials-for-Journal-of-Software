```python
async def async_unload_entry(
    hass: HomeAssistant, config_entry: ConfigEntry
) -> bool:
    # Forward to the same platform as async_setup_entry did
    return await hass.config_entries.async_unload_platforms(config_entry, PLATFORMS)
```