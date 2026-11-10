```python
def login(self):
    query = '''
    mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        access_token
      }
    }'''
    variables = {
        'username': 'gm',
        'password': 'centric8'
    }
    result = self.client.execute("login", query, variables)

    # Inject the Access Token in the Client, so subsequent requests can be made
    self.client.inject_token(result['data']['login']['access_token'])
```