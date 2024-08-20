from django.urls import re_path

from chats.consumers import RoomChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_key>\w+)$', RoomChatConsumer.as_asgi()),
]