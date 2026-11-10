```python
def create_user(self, email, password=None, **extra_fields):
    """
    Creates and saves a user with the given email and password.
    
    Aided with basic GitHub coding tools
    """
    if not email:
        raise ValueError("The Email field must be set")
    
    email = self.normalize_email(email)
    
    # If username is not provided, use part of the email as username
    if 'username' not in extra_fields or not extra_fields['username']:
        username = email.split('@')[0]
        # Ensure username is unique by adding a suffix if needed
        base_username = username
        counter = 1
        while self.model.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        extra_fields['username'] = username
    
    user = self.model(email=email, **extra_fields)
    user.set_password(password)
    user.save(using=self._db)
    return user
```
```python
def create_superuser(self, email, password=None, **extra_fields):
    """
    Creates and saves a superuser with the given email and password.
    
    Aided with basic GitHub coding tools
    """
    extra_fields.setdefault('is_staff', True)
    extra_fields.setdefault('is_superuser', True)
    extra_fields.setdefault('is_active', True)

    return self.create_user(email, password, **extra_fields)
```