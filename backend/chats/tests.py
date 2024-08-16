from django.test import TestCase

from .models import Chat
from rooms.models import Room
from users.models import AppUser
from users.views import CurrentUserView

class ChatTestCase(TestCase):
    def setUp(self) -> None:
        usr = AppUser.objects.create(email='testuser@musichat.com', username='testuser', password='testuser1-123*')
        room = Room.objects.create(host=usr, max_users=3)
        Chat.objects.create(room=room)
    
    def test_chat_creation(self):
        chat = Chat.objects.all()
        chat = chat[0]
        self.assertIsInstance(chat, Chat)