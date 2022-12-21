import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('CONNECTED')
        user = self.scope['user']
        chat_members = [member for member in self.scope['url_route']['kwargs'].values()]
        if user not in chat_members:
            self.disconnect('Not valid user')
        if user == chat_members[0]:
            friend = chat_members[1]
        else:
            friend = chat_members[0]
        print(f'Established connection between {user} and {friend}.')
        await self.accept()

    async def disconnect(self, code):
        print('DISCONNECTED')
        pass

    async def receive(self, text_data=None, bytes_data=None):
        print('RECEIVED DATA')
        pass