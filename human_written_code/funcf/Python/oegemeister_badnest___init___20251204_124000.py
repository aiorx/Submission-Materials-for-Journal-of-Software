```python
def setup(hass, config):
    if config.get(DOMAIN) is not None:
        conf_type = config[DOMAIN].get(CONF_TYPE)
        issue_token = config[DOMAIN].get(CONF_ISSUE_TOKEN)
        cookie = config[DOMAIN].get(CONF_COOKIE)
        api_key = config[DOMAIN].get(CONF_APIKEY)
        email = config[DOMAIN].get(CONF_EMAIL)
        password = config[DOMAIN].get(CONF_PASSWORD)
    else:
        conf_type = None
        email = None
        password = None
        issue_token = None
        cookie = None
        api_key = None

    from .api import NestAPI
    api = NestAPI(
        conf_type,
        email,
        password,
        issue_token,
        cookie,
        api_key
    )

    hass.data[DOMAIN] = api

    return True
```