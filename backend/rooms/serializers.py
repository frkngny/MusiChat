from rest_framework import serializers

from .models import Room
from users.serializers import UserSerializer
from chats.serializers import RoomChatSerializer


class RoomSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    chat = RoomChatSerializer(read_only=True, source='get_chat')
    class Meta:
        model = Room
        fields = '__all__'
        
class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['max_users', 'is_public', 'allow_messages']