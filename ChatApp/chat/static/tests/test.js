// Variables

const friends_window = document.querySelector('#friends-window');
const chat1 = document.querySelector('#chat1');
const chat2 = document.querySelector('#chat2');
const chat3 = document.querySelector('#chat3');

let active_chats = [];
let chat_count = 0;

// Functions

function new_chat(friend) {
    if (active_chats.includes(friend)) {
        return;
    }
    active_chats.push(friend);
    if (chat_count === 0) {
        chat1.getElementsByClassName('chat-head')[0].innerText = friend;
        chat1.style.display = 'flex';
    }
    else if (chat_count === 1) {
        chat2.getElementsByClassName('chat-head')[0].innerText = friend;
        chat2.style.display = 'flex';
    }
    else {
        chat3.getElementsByClassName('chat-head')[0].innerText = friend;
        chat3.style.display = 'flex';
    }
    chat_count = Math.min(3, chat_count + 1);
    console.log(chat_count);
}


// Events

friends_window.addEventListener('click', function(e) {
    let t = e.target;
    if (t.id === 'friend') {
        new_chat(t.innerText);
    }
})