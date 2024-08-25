from channels.generic.websocket import AsyncWebsocketConsumer
import json

class RoomChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_key = self.scope['url_route']['kwargs']['room_key']
        self.room_chat_group_name = 'chat_%s' % self.room_key
        
        await self.channel_layer.group_add(
            self.room_chat_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        await self.channel_layer.group_send(
            self.room_chat_group_name,
            {
                'type': 'welcome_message',
                'message': 'You can now send messages.'
            }
        )
    
    async def chat_message(self, event):
        message = event['message']
        await self.send(
                text_data=json.dumps(
                    {
                        'type': 'chat_message',
                        'message': message
                    }
                )
            )
        
    async def welcome_message(self, event):
        message = event['message']
        await self.send(
                text_data=json.dumps(
                    {
                        'type': 'welcome_message',
                        'message': message
                    }
                )
            )
    
    async def disconnect(self, close_code):
        self.channel_layer.group_discard(
            self.room_chat_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data['message']
        self.send(text_data=json.dumps({'message': message}))
        return await super().receive(text_data, bytes_data)