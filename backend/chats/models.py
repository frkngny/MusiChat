from django.db import models
import uuid

from rooms.models import Room
from django.contrib.auth import get_user_model

class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.OneToOneField(Room, on_delete=models.CASCADE, related_name='chat', unique=True)
    
    def __str__(self) -> str:
        return f"Chat for room: {self.room.key}"
    
    def get_messages(self):
        return self.messages.all()
    
    def get_room(self):
        return {'id': self.room.id, 'key': self.room.key}

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING, related_name='messages')
    text = models.CharField(max_length=500, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return f"User: {self.sender.username}, Room: {self.chat.room.key}"
    
    class Meta:
        ordering = ['date']