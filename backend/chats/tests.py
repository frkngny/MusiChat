from django.test import TestCase

from .models import Chat, Message
from rooms.models import Room
from users.models import AppUser
from users.views import CurrentUserView

class ChatTestCase(TestCase):
    room = None
    def setUp(self) -> None:
        usr = AppUser.objects.create(email='testuser@musichat.com', username='testuser', password='testuser1-123*')
        self.room = Room.objects.create(host=usr, max_users=3)
    
    def test_chat_creation(self):
        chat = self.room.chat
        self.assertIsInstance(chat, Chat)
    

class MessageTestCase(TestCase):
    usr = None
    room = None
    def setUp(self) -> None:
        self.usr = AppUser.objects.create(email='testuser@musichat.com', username='testuser', password='testuser1-123*')
        self.room = Room.objects.create(host=self.usr, max_users=3)
    
    def test_chat_creation(self):
        msg = Message.objects.create(chat=self.room.chat, sender=self.usr, text="test text")
        self.assertIsInstance(msg, Message)