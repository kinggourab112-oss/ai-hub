const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const API_KEYS = {
    chatgpt: "Sk-proj-TSKlQzPvXlzvwAENPS5iKqSktXagJOSbd-mJ7u2S27i5T2h4DgtJT3gkflnQVz1If5c11Wutj3T3BlbkFJovPQ3SXfqG159yhYlsL9BbF2Hsv2ldSPaelIIINcaGwxryPi8S0V8hme0kAT13LKl9MFcycmAA",
    gemini: "AQ.Ab8RN6La_pqYuTUKJqJYTJ4fE_-kO3653SifGgxl1hLmqvXlcA",
    grok: "xai-k4V6Of5v7aYxZkhl3B744C3E7QtQ4thm5HXYj8cl0gOYMOjPRRETPZ68IerDUTlbiX0YKMn02bBGSrqY",
    meta: "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"
};

app.post('/api/chat', async (req, res) => {
    const { model, message } = req.body;
    try {
        let reply = "";
        if (model === 'chatgpt') {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEYS.chatgpt}` },
                body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: message }] })
            });
            const data = await response.json();
            reply = data.choices[0].message.content;
        } else if (model === 'gemini') {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEYS.gemini}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
            });
            const data = await response.json();
            reply = data.candidates[0].content.parts[0].text;
        } else if (model === 'grok') {
            const response = await fetch('https://api.x.ai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEYS.grok}` },
                body: JSON.stringify({ model: 'grok-beta', messages: [{ role: 'user', content: message }] })
            });
            const data = await response.json();
            reply = data.choices[0].message.content;
        } else if (model === 'meta') {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEYS.meta}` },
                body: JSON.stringify({ model: 'llama3-8b-8192', messages: [{ role: 'user', content: message }] })
            });
            const data = await response.json();
            reply = data.choices[0].message.content;
        }
        res.json({ success: true, reply });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
