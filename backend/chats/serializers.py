from rest_framework import serializers

from .models import Chat, Message
from users.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    class Meta:
        model = Message
        # fields = '__all__'
        exclude = ['chat']
        
class RoomChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'
        
class ChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(source='get_messages', many=True)
    class Meta:
        model = Chat
        fields = '__all__'