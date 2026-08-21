const chatViewport = document.getElementById('chatViewport');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const aiModel = document.getElementById('aiModel');

async function handleSendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    const welcome = document.querySelector('.welcome-box');
    if (welcome) welcome.remove();

    chatViewport.innerHTML += `<div class="message-row user"><div class="bubble">${escapeHtml(text)}</div></div>`;
    userInput.value = '';
    chatViewport.scrollTop = chatViewport.scrollHeight;

    const loadingId = 'loading-' + Date.now();
    chatViewport.innerHTML += `<div class="message-row ai" id="${loadingId}"><div class="bubble" style="color: #9aa0a6;">প্রসেসিং হচ্ছে...</div></div>`;
    chatViewport.scrollTop = chatViewport.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: aiModel.value, message: text })
        });
        const data = await response.json();
        
        document.getElementById(loadingId).remove();

        if (data.success) {
            chatViewport.innerHTML += `<div class="message-row ai"><div class="bubble">${escapeHtml(data.reply)}</div></div>`;
        } else {
            chatViewport.innerHTML += `<div class="message-row ai"><div class="bubble" style="color: #ff8080;">ত্রুটি: ${escapeHtml(data.error)}</div></div>`;
        }
    } catch (err) {
        document.getElementById(loadingId).remove();
        chatViewport.innerHTML += `<div class="message-row ai"><div class="bubble" style="color: #ff8080;">সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি!</div></div>`;
    }
    chatViewport.scrollTop = chatViewport.scrollHeight;
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

sendBtn.addEventListener('click', handleSendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});
