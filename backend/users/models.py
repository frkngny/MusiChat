from django.db import models
from django.contrib.auth.models import AbstractUser


class AppUser(AbstractUser):
    email = models.EmailField(max_length=100, unique=True, null=False)
    username = models.CharField(max_length=100, unique=True, null=False)
    
    image = models.ImageField(default='default.jpg', upload_to='profile_photos', null=True, blank=True)
    
    def __str__(self) -> str:
        return self.username
    
    def get_messages(self):
        return self.messages.all()