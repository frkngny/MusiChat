from rest_framework import serializers

from .models import Room
from users.serializers import UserSerializer


class RoomSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    class Meta:
        model = Room
        fields = ('__all__')
        
class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('max_users', 'is_public')