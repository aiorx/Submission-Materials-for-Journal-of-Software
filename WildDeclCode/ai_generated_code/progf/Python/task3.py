import jwt

def validate_jwt(token: str) -> bool:
    """
    Validates a JWT token.
    :param token: JWT token to validate.
    :return: True if the token is valid, False otherwise.
    """
    try:
        jwt.decode(token, 'secret', algorithms=['HS256'])
        return True
    except jwt.exceptions.InvalidSignatureError:
        return False
    except jwt.exceptions.DecodeError:
        return False

# code above returned by co pilot if the import is given
# would be better if `jwt.exceptions.InvalidTokenError` is caught

def check_authorization_bearer_jwt(headers: dict) -> bool:
    auth_header = headers.get('Authorization')
    if auth_header is None:
        return False
    if not auth_header.startswith('Bearer '):
        return False
    token = auth_header[7:]
    return validate_jwt(token)

#code was Supported via standard GitHub programming aids line by line