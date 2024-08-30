from django.urls import re_path

from chats.consumers import RoomChatConsumer
from rooms.consumers import RoomConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_key>\w+)$', RoomChatConsumer.as_asgi()),
    re_path(r'ws/room/(?P<room_key>\w+)', RoomConsumer.as_asgi()),
]