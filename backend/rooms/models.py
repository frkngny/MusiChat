from django.db import models
from django.contrib.auth import get_user_model
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
    host = models.OneToOneField(get_user_model(), on_delete=models.CASCADE, related_name='rooms')
    key = models.CharField(max_length=10, default=generate_unique_key, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    max_users = models.PositiveIntegerField(default=8, validators=[MaxValueValidator(8), MinValueValidator(1)])
    is_public = models.BooleanField(default=True)
    allow_messages = models.BooleanField(default=True)
    joined_users = models.ManyToManyField(get_user_model(), blank=True, related_name='in_room')
    banned_users = models.ManyToManyField(get_user_model(), blank=True, related_name='banned_from')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.key} - {self.host.username}'
    
    def get_chat(self):
        return self.chat
    
    def joined_users_count(self):
        return self.joined_users.count()