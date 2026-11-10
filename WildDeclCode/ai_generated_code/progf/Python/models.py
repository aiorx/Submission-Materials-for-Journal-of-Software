from django.db import models
from django.contrib.auth.models import User #Django user model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

# https://docs.djangoproject.com/en/5.0/topics/signals/ signals for the User to Profile transfer
# https://www.devhandbook.com/django/user-profile/
# https://forum.djangoproject.com/t/what-would-be-the-best-approach-to-create-a-separate-profile-page-for-registered-users/15141
# https://docs.djangoproject.com/en/dev/ref/models/fields/#choices
# 

# docs powered by CoPilot

# Wes -- Penned via standard GitHub programming aids and modified to fit my needs, 
# This is the model for the calendar and todo list
class Event(models.Model):
    """
    Represents an event.

    Attributes:
        title (str): The title of the event.
        description (str): The description of the event.
        completed (bool): Indicates whether the event is completed or not.
        date (datetime.date): The date of the event.
        time (datetime.time): The time of the event.
        created_at (datetime.datetime): The timestamp when the event was created.
    """
    title = models.CharField(max_length=100)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    date = models.DateField()
    time = models.TimeField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,  null=True)
    #url
    url = models.URLField(null=True, blank=True, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

# Seamus 
# Same as the view, reading materials have been repurposed to be onboarding items
# not renamed due to complications with django migrations
class readingMaterial(models.Model):
    """
    Represents a piece of reading material.

    Attributes:
        title (str): The title of the reading material.
        read (bool): Indicates whether the reading material has been read or not.
    """

    title = models.CharField(max_length=100)
    read = models.BooleanField(default=False)

    def __str__(self):
        return self.title
# Wes -- Extra comments not added by me, but the base class was mine 
class classList(models.Model):
    """
    Represents a class.

    Attributes:
        title (str): The title of the class.
        description (str): The description of the class.
        attributes (str): The attributes of the class. Theory, applications, ect
        current (bool): Indicates whether the class is currently being taken or not.
        completed (bool): Indicates whether the class is completed or not.
        time (datetime.time): The time of the class.
        date (str): The dates of the class, Aka monday, wednesday, friday
    """
    title = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    attributes = models.CharField(max_length=100)
    completed = models.BooleanField(default=False)
    currently_taking = models.BooleanField(default=False)
    time = models.TimeField(null=True, blank=True)
    date = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.title


class Supply(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

# Seamus 
# Model for user profiles
class Profile(models.Model):
    """
    Represents a user profile.

    Attributes:
        user (User): The user associated with the profile.
        bio (str): The biography of the user.
        location (str): The location of the user.
        pets (str): The pets of the user.
        interests (str): The interests of the user.
        profile_picture (ImageField): The profile picture of the user.

        
    """

    USER_YEARS_CHOICES = (
        ('Inbound', 'Inbound Novo'),
        ('Current', 'Current Novo'),
        ('Alum', 'Novo Alum'),
    )

    def user_directory_path(instance, filename):
        """
        Returns the directory path for uploading a file based on the user's username.

        Args:
            instance: The instance of the model where the file is being uploaded.
            filename: The original filename of the uploaded file.

        Returns:
            The directory path for uploading the file, in the format 'userprofiles/<username>/<filename>'.
        """
        return f'userprofiles/{instance.user.username}/{filename}'

    user = models.OneToOneField(User, on_delete=models.CASCADE) # grab user for profile
    bio = models.TextField(max_length=500, blank=True)  # bio for user
    user_years = models.CharField(max_length=20, choices=USER_YEARS_CHOICES, default='inbound') # user years for user
    location = models.CharField(max_length=30, blank=True) # location for user
    pets = models.CharField(max_length=30, blank=True) # pets for user
    interests = models.CharField(max_length=100, blank=True) # interests for user
    profile_picture = models.ImageField(upload_to=user_directory_path, null=True, blank=True, default='userprofiles/default.jpg') # profile picture for user 

    # Boolean fields for badges, keeping it simple.
    classBadge = models.BooleanField(default=False)
    dormBadge = models.BooleanField(default=False)
    hamBadge = models.BooleanField(default=False)
    eventsBadge = models.BooleanField(default=False)
    facultyBadge = models.BooleanField(default=False)

    badgeScore = models.IntegerField(default=0)

    def __str__(self): 
        return f'{self.user.username} Profile'
    
# Seamus 
# Signal to create or update the user profile
@receiver(post_save, sender=User) # When a user is saved, send the signal to create or update the profile
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Create or update the user profile.

    Parameters:
    - sender: The sender of the signal.
    - instance: The instance of the user model.
    - created: A boolean indicating whether the user is created or updated.
    - kwargs: Additional keyword arguments.

    Returns:
    None
    """
    if created: # if the user is created
        Profile.objects.create(user=instance) # create the profile
    else: # if the user is updated
        instance.profile.save() # save the profile


#Bilge
class Post(models.Model):
    content = models.TextField(max_length=500)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content
    