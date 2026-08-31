```python
def get_database_settings():
    return {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'db_django_rf',
            'USER': 'root',
            'PASSWORD': 'root',
            'HOST': 'localhost',
            'PORT': 3306,
            'OPTIONS': {
                'init_command': 'SET sql_mode="STRICT_TRANS_TABLES"'
            }
        }
    }
```