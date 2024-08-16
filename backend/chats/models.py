from django.db import models
import uuid

from rooms.models import Room
from users.models import AppUser as UserModel

class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.OneToOneField(Room, on_delete=models.CASCADE, related_name='chat', unique=True)
    
    def get_messages(self):
        return self.messages.all()

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(UserModel, on_delete=models.DO_NOTHING, related_name='messages')
    text = models.CharField(max_length=500, null=False, blank=False)
    date = models.DateTimeField(auto_now_add=True)