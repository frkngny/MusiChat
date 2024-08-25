from rest_framework import serializers

from .models import Chat, Message
from users.serializers import UserSerializer
from rooms.models import Room

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    chat = serializers.CharField()
    class Meta:
        model = Message
        fields = '__all__'
        
class SendMessageSerializer(serializers.ModelSerializer):
    text = serializers.CharField(required=True, max_length=500)
    class Meta:
        model = Message
        fields = '__all__'
        
class RoomChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'
        
class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(source='get_messages', many=True)
    class Meta:
        model = Chat
        fields = ['id', 'messages', 'get_room']