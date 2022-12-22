import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user'].username

        if user != self.scope['url_route']['kwargs']['user']:
            self.disconnect('invalid user')
        friend = self.scope['url_route']['kwargs']['friend']
        if not self.valid_friend(user, friend):
            self.disconnect('invalid friend')

        self.group_name = await self.get_group_name(user, friend)
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, code):
        print('DISCONNECTED', code)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        

    async def receive(self, text_data=None, bytes_data=None):
        message = json.loads(text_data)['message']
        sender = json.loads(text_data)['sender']
        
        await self.channel_layer.group_send(
            self.group_name, {'type': 'chat_message', 'message': message, 'sender': sender}
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        text_data = json.dumps({'message': message, 'sender': sender})
        await self.send(text_data=text_data)    

    async def get_group_name(self, user, friend):
        if user < friend:
            return f'{user}-{friend}'
        else:
            return f'{friend}-{user}'

    @database_sync_to_async
    def valid_friend(self, user, friend):
        return friend in User.objects.exclude(username=user)