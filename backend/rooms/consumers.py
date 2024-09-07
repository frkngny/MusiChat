from channels.generic.websocket import AsyncWebsocketConsumer
import json

from users.serializers import UserSerializer
from rooms.models import Room

from asgiref.sync import sync_to_async


@sync_to_async
def get_room_users(room_key):
    data = {
        'joined': UserSerializer(Room.objects.get(key=room_key).joined_users, many=True).data,
        'banned': UserSerializer(Room.objects.get(key=room_key).banned_users, many=True).data
    }
    return data

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_key = self.scope['url_route']['kwargs']['room_key']
        self.room_group_name = 'room_%s' % self.room_key
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        room_users = await get_room_users(self.room_key)
        
        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         'type': 'room_users',
        #         'data': room_users
        #     }
        # )
        
    async def room_users(self, event):
        data = event['data']
        await self.send(
            text_data=json.dumps(
                {
                    'type': 'room_users',
                    'data': data
                }
            )
        )
        
    async def room(self, event):
        data = event['data']
        await self.send(
            text_data=json.dumps(
                {
                    'type': 'room',
                    'data': data
                }
            )
        )
        
    async def disconnect(self, close_code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data['message']
        self.send(text_data=json.dumps({'message': message}))
        return await super().receive(text_data, bytes_data)