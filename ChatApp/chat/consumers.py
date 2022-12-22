import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from .models import ChatMessage

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
        data = json.loads(text_data)
        sender = data['sender']
        receiver = data['receiver']
        message = data['message']
        
        sent_at = await self.save_message_and_return_timestamp(sender, receiver, self.group_name, message)

        await self.channel_layer.group_send(
            self.group_name, {
                'type': 'chat_message',
                'message': message,
                'sender': sender,
                'sent_at': sent_at
                }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']
        sent_at = event['sent_at']
        text_data = json.dumps({'message': message, 'sender': sender, 'sent_at': sent_at})
        await self.send(text_data=text_data)    

    async def get_group_name(self, user, friend):
        if user < friend:
            return f'{user}-{friend}'
        else:
            return f'{friend}-{user}'

    @database_sync_to_async
    def valid_friend(self, user, friend):
        return friend in User.objects.exclude(username=user)

    @database_sync_to_async
    def save_message_and_return_timestamp(self, sender, receiver, group, content):
        message = ChatMessage.objects.create(
            sender=User.objects.get(username=sender),
            receiver=User.objects.get(username=receiver),
            group=group,
            content=content
        )
        return json.dumps(message.sent_at, default=str)