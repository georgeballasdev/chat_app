// Variables
const chat_window = document.querySelector('#chat-window');
const friends_window = document.querySelector('#friends-window');
const chat1 = document.querySelector('#chat1');
const chat2 = document.querySelector('#chat2');
const chat3 = document.querySelector('#chat3');
const closebtn1 = document.querySelector('#close-btn-1');
const closebtn2 = document.querySelector('#close-btn-2');
const closebtn3 = document.querySelector('#close-btn-3');
const closebtns = ['close-btn-1', 'close-btn-2', 'close-btn-3'];
let active_chats = [];

// Functions

function move_chat(chat, prev_chat) {
    if (chat.style.display != 'flex') {
        prev_chat.style.display = 'none';
        return;
    }
    prev_chat.innerHTML = chat.innerHTML;
    chat.style.display = 'none';
    prev_chat.style.display = 'flex';
}

function close_chat(chat, friend) {
    if (chat == chat3) {
        chat.style.display = 'none';
    }
    else if (chat == chat2) {
        move_chat(chat3, chat2);
    }
    else {
        move_chat(chat2, chat1);
        move_chat(chat3, chat2);
    }
    active_chats.splice(active_chats.indexOf(friend), 1);
}

function new_chat(friend) {
    if (active_chats.includes(friend)) {
        return;
    }
    let chat_count = active_chats.length;
    if (chat_count === 0) {
        chat1.querySelector('.chat-head span').innerText = friend;
        chat1.style.display = 'flex';
    }
    else if (chat_count === 1) {
        chat2.querySelector('.chat-head span').innerText = friend;
        chat2.style.display = 'flex';
    }
    else {
        if (chat_count == 3) {
            close_chat(chat3, friend);
        };
        chat3.querySelector('.chat-head span').innerText = friend;
        chat3.style.display = 'flex';
    }
    active_chats.push(friend);
}


// Events

friends_window.addEventListener('click', function(e) {
    let t = e.target;
    if (t.id == 'friend') {
        new_chat(t.innerText);
    }
})

chat_window.addEventListener('click', function(e) {
    if (closebtns.includes(e.target.id)) {
        let friend = e.target.previousElementSibling.innerText;
        let chat = e.target.parentElement.parentElement;
        close_chat(chat, friend);
    }
    else if (e.target.className.includes('chat-head')) {
        console.log('collapse');
        s1 = e.target.nextElementSibling;
        s2 = s1.nextElementSibling;
        s1.classList.toggle('collapsed');
        s2.classList.toggle('collapsed');
    }
})