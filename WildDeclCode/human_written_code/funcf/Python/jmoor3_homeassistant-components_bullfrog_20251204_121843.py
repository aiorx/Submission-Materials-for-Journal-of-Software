```python
def setup_spa(hass, config):
    """Set up the Bullfrog Spa."""

    conf = config[DOMAIN]
    # scan_interval = conf[CONF_SCAN_INTERVAL]

    discovery.load_platform(hass, 'climate', DOMAIN, conf, config)
    discovery.load_platform(hass, 'light', DOMAIN, conf, config)
    discovery.load_platform(hass, 'switch', DOMAIN, conf, config)
```