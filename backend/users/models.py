from django.db import models
from django.contrib.auth.models import AbstractUser


class AppUser(AbstractUser):
    email = models.EmailField(max_length=100, unique=True, null=False)
    username = models.CharField(max_length=100, unique=True, null=False)
    
    def __str__(self) -> str:
        return self.username
    
    def get_messages(self):
        return self.messages.all()
    
    def get_joined_rooms(self):
        return self.in_room.all()

class Profile(models.Model):
    user = models.OneToOneField(AppUser, on_delete=models.CASCADE, related_name='profile')
    image = models.ImageField(default='default.jpg', upload_to='profile_photos', null=True, blank=True)
    friends = models.ManyToManyField('self', null=True, blank=True)

class UserFriendshipManager(models.Manager):
    def invitations_received(self, receiver):
        return UserFriendship.objects.filter(receiver=receiver, status='sent')
    def invitations_sent(self, sender):
        return UserFriendship.objects.filter(sender=sender, status='sent')

class UserFriendship(models.Model):
    STATUSES = {
        'sent': 'Sent',
        'accepted': 'Accepted'
    }
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_friend_request')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_friend_request')
    status = models.CharField(max_length=8, choices=STATUSES)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    objects = UserFriendshipManager()

    def __str__(self) -> str:
        return f"{self.sender} - {self.receiver} - {self.status}"
