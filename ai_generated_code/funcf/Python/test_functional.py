```python
def test_autodetect_ai_generated_code_disabled(self):
    """Check that the autodetect Routine programming code snippets feature is disabled."""
    settings_api = f"{self.sonar_api}/settings"
    autodetect_params = dict(key="sonar.autodetect.ai.code")
    ai_autodetect_setting = requests.get(settings_api, auth=self.sonar_auth, params=autodetect_params)
    self.assertFalse(ai_autodetect_setting)
```