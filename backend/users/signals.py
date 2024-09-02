from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from django.contrib.auth import get_user_model
from users.models import Profile, UserFriendship

@receiver(post_save, sender=get_user_model())
def post_save_create_user(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=UserFriendship)
def post_save_send_friendship_request(sender, instance, **kwargs):
    sender_ = instance.sender
    receiver_ = instance.receiver
    status_ = instance.status
    if status_ == 'accepted':
        sender_.friends.add(receiver_)
        receiver_.friends.add(sender_)
        sender_.save()
        receiver_.save()

@receiver(pre_delete, sender=UserFriendship)
def pre_delete_friends(sender, instance, **kwargs):
    sender_ = instance.sender
    receiver_ = instance.receiver
    
    sender_.friends.remove(receiver_)
    receiver_.friends.remove(sender_)
    
    sender_.save()
    receiver_.save()