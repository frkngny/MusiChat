from django.db import models
from users.models import AppUser as UserModel
from django.core.validators import MaxValueValidator, MinValueValidator

import random, string
from datetime import datetime

def generate_unique_key():
    length = 10
    while True:
        key = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(key=key).count() == 0:
            break
    return key

class Room(models.Model):
    host = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='rooms')
    max_users = models.PositiveIntegerField(default=8, validators=[MaxValueValidator(8), MinValueValidator(1)])
    is_public = models.BooleanField(default=True)
    key = models.CharField(max_length=10, default=generate_unique_key, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.key} - {self.host.username}'