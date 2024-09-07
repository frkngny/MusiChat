from rest_framework import serializers

from .models import Room
from users.serializers import UserSerializer
from chats.serializers import RoomChatSerializer


class RoomSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    chat = RoomChatSerializer(read_only=True, source='get_chat')
    joined_users = UserSerializer(read_only=True, many=True)
    banned_users = UserSerializer(read_only=True, many=True)
    class Meta:
        model = Room
        fields = '__all__'
        
class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['max_users', 'is_public', 'allow_messages']

class RoomSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['max_users', 'is_public', 'allow_messages']
        read_only_fields = ['key', 'host', 'created_at']
    
    def validate(self, attrs):
        if len(attrs) == 0 or (len(attrs) == 1 and 'key' in attrs):
            raise serializers.ValidationError('Nothing found to update.')
        return super().validate(attrs)
    
    def update(self, instance, validated_data):
        instance.max_users = validated_data.get('max_users', instance.max_users)
        instance.is_public = validated_data.get('is_public', instance.is_public)
        instance.allow_messages = validated_data.get('allow_messages', instance.allow_messages)
        instance.save(update_fields=validated_data.keys())
        return instance