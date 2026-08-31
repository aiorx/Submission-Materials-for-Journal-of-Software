# This code was Supported by standard GitHub tools
import hashlib
password = "mypassword"
hashed_password = hashlib.md5(password.encode()).hexdigest()

