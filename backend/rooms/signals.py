from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Room
from chats.models import Chat

@receiver(post_save, sender=Room)
def post_save_create_room(sender, instance, created, **kwargs):
    if created:
        Chat.objects.create(room=instance)