const chatLog = document.getElementById('chat-log'),
    userInput = document.getElementById('user-input'),
    sendButton = document.getElementById('send-button'),
    buttonIcon = document.getElementById('button-icon'),
    info = document.querySelector('.info');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    if (message === 'developer') {
        userInput.value = '';
        appendMessage('user', message);
        setTimeout(() => {
            appendMessage('bot', 'This Source Coded By Jack \nYoutube : @AsmrProg');
            resetButtonIcon();
        }, 2000);
        return;
    }

    appendMessage('user', message);
    userInput.value = '';

    // 你的 OpenAI API Key (替换成你的 Key)
    const OPENAI_API_KEY = 'Enter your official Openai API key';

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // 可改成 "gpt-4"
            messages: [{ role: "user", content: message }]
        })
    };

    fetch('https://api.openai.com/v1/chat/completions', options)
        .then(response => response.json())
        .then(response => {
            if (response.choices && response.choices.length > 0) {
                appendMessage('bot', response.choices[0].message.content);
            } else {
                appendMessage('bot', 'Error: Unexpected API response format.');
            }
        })
        .catch(err => {
            console.error(err);
            appendMessage('bot', 'Error: Failed to fetch response.');
        })
        .finally(() => {
            resetButtonIcon();
        });
}

function appendMessage(sender, message) {
    info.style.display = "none";
    buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
    buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');

    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.classList.add("chat-box");
    iconElement.classList.add("icon");
    messageElement.classList.add(sender);
    messageElement.innerText = message;

    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.setAttribute('id', 'user-icon');
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.setAttribute('id', 'bot-icon');
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);
    chatLog.appendChild(chatElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function resetButtonIcon() {
    buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
    buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
}
