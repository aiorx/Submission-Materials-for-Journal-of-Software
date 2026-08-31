```python
class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.
    
    Handles user creation, update and profile management. Provides validation
    for email uniqueness and password strength.
    
    Example request data:
    ```json
    {
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "password": "StrongPassword123!",
        "role": 1
    }
    ```
    
    Supported via standard GitHub programming aids
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'password', 
            'first_name', 'last_name', 'role',
            'date_joined', 'is_active'
        ]
        read_only_fields = ['id', 'date_joined']
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': False}
        }
    
    def validate_email(self, value):
        """
        Validate email uniqueness.
        
        Args:
            value (str): The email to validate
            
        Returns:
            str: The validated email
            
        Raises:
            ValidationError: If the email is already in use
        """
        user = User.objects.filter(email=value)
        if self.instance:
            user = user.exclude(pk=self.instance.pk)
        if user.exists():
            raise serializers.ValidationError("This email is already in use.")
        return value
    
    def validate_password(self, value):
        """
        Validate password using Django's password validators.
        
        Args:
            value (str): The password to validate
            
        Returns:
            str: The validated password
            
        Raises:
            ValidationError: If the password doesn't meet the validation criteria
        """
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
    def create(self, validated_data):
        """
        Create and return a new user with encrypted password.
        
        Args:
            validated_data (dict): Data that passed validation
            
        Returns:
            User: The newly created user instance
        """
        # Remove and save the password
        password = validated_data.pop('password', None)
        
        # Create user instance
        user = User.objects.create_user(
            **validated_data,
            password=password
        )
        
        return user
    
    def update(self, instance, validated_data):
        """
        Update and return an existing user.
        
        Args:
            instance (User): The user instance to update
            validated_data (dict): Data that passed validation
            
        Returns:
            User: The updated user instance
        """
        # Handle password separately
        password = validated_data.pop('password', None)
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Set password if provided
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
```

```python
class UserProfileSerializer(UserSerializer):
    """
    Extended serializer for User model that includes all profile fields.
    
    This serializer extends UserSerializer to include additional profile fields
    like profile_picture, address, and contact information.
    
    Example request data:
    ```json
    {
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "password": "StrongPassword123!",
        "role": 1,
        "profile_picture": null,
        "birth_date": "1990-01-01",
        "birth_city": "Rabat",
        "CIN_id": "AB123456",
        "phone_number": "0612345678",
        "address": "123 Main St",
        "city": "Casablanca"
    }
    ```
    
    Supported via standard GitHub programming aids
    """
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + [
            'profile_picture', 'birth_date', 'birth_city', 
            'Arabic_first_name', 'arabic_last_name',
            'CIN_id', 'phone_number', 'address', 'city',
            'created_at', 'updated_at'
        ]
        read_only_fields = UserSerializer.Meta.read_only_fields + [
            'created_at', 'updated_at'
        ]
    
    def validate_CIN_id(self, value):
        """
        Validate CIN (National ID) format.
        
        Args:
            value (str): The CIN ID to validate
            
        Returns:
            str: The validated CIN ID
            
        Raises:
            ValidationError: If the CIN ID format is invalid
        """
        if value and not value.isalnum():
            raise serializers.ValidationError(
                "CIN ID should only contain alphanumeric characters."
            )
        return value
    
    def validate_phone_number(self, value):
        """
        Validate phone number format.
        
        Args:
            value (str): The phone number to validate
            
        Returns:
            str: The validated phone number
            
        Raises:
            ValidationError: If the phone number format is invalid
        """
        if value and not value.isdigit():
            raise serializers.ValidationError(
                "Phone number should only contain numeric characters."
            )
        return value
    
    def to_representation(self, instance):
        """
        Add the role display name and profile picture URL to the response.
        
        Args:
            instance (User): The user instance
            
        Returns:
            dict: The serialized representation with role_display and profile_picture URL added
        """
        representation = super().to_representation(instance)
        representation['role_display'] = instance.get_role_display()
        # Explicitly set profile_picture to its URL if it exists
        if instance.profile_picture and hasattr(instance.profile_picture, 'url'):
            representation['profile_picture'] = instance.profile_picture.url
        else:
            representation['profile_picture'] = None # Or an empty string, depending on frontend expectation
        return representation
```