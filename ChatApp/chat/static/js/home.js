const username = document.querySelector('#username').textContent;
const chat = document.querySelector('#chat');
const chat_log = document.querySelector('#chat-log');
let sockets = {}
let friends = document.querySelectorAll(".friend");

function handleSocket(url, friend) {
    if (url in sockets) {
        console.log('already in sockets');
        var chatSocket = sockets[url];
    }
    else {
        sockets[url] = new WebSocket(url);
        var chatSocket = sockets[url];
        console.log('Added new socket '+ chatSocket)
    }
    
    chatSocket.onopen = function(e) {
        chatSocket.send(JSON.stringify({
            'command': 'get_messages',
        }));
    }

    chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            const chat_log = document.getElementById('chat-log');
            if (data['command'] == 'get_messages') {
                const messages = data['messages'];
                var message;
                for (var i = 0; i < messages.length; i++) {
                    message = messages[i];
                    chat_log.value += (message.sender + ': ' + message.content +  message.timestamp + '\n');
                }
            }
            else {
                chat_log.value += (data.sender + ': ' + data.content +  data.timestamp + '\n');
            }
        };

    chatSocket.onclose = function(e) {
        delete sockets[url];
        console.error('WS closed');
    };

    document.querySelector('#msg-input').onkeyup = function(e) {
        if (e.keyCode === 13) {
            document.querySelector('#msg-submit').click();
        }
    };

    document.querySelector('#msg-submit').onclick = function(e) {
        const msgDom = document.querySelector('#msg-input');
        const msg = msgDom.value;
        chatSocket.send(JSON.stringify({
            'command': 'new_message',
            'sender': username,
            'receiver': friend,
            'content': msg,
        }));
        msgDom.value = '';
    };
}

function getChatUrl(friend) {
    var url = 'ws://' + window.location.host + '/ws/chat/' +
                username + '-' + friend + '/';
    return url;
}

for (var i = 0; i < friends.length; i++) {
    friends[i].onclick = function(e) {
        chat.childNodes[1].textContent = 'Chat log with ' + this.textContent;
        chat_log.value = '';
        chat.style.display = "block";
        document.querySelector('#msg-input').focus();
        handleSocket(getChatUrl(this.textContent), this.textContent);
}
}