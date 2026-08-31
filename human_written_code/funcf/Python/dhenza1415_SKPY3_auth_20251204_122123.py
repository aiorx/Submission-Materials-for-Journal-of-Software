```python
def __loginRequest(self, type, data):
    lReq = LoginRequest()
    if type == '0':
        lReq.type = LoginType.ID_CREDENTIAL
        lReq.identityProvider = data['identityProvider']
        lReq.identifier = data['identifier']
        lReq.password = data['password']
        lReq.keepLoggedIn = data['keepLoggedIn']
        lReq.accessLocation = data['accessLocation']
        lReq.systemName = data['systemName']
        lReq.certificate = data['certificate']
        lReq.e2eeVersion = data['e2eeVersion']
    elif type == '1':
        lReq.type = LoginType.QRCODE
        lReq.keepLoggedIn = data['keepLoggedIn']
        if 'identityProvider' in data:
            lReq.identityProvider = data['identityProvider']
        if 'accessLocation' in data:
            lReq.accessLocation = data['accessLocation']
        if 'systemName' in data:
            lReq.systemName = data['systemName']
        lReq.verifier = data['verifier']
        lReq.e2eeVersion = data['e2eeVersion']
    else:
        lReq=False
    return lReq
```