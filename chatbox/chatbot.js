const apiKey = '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'; 

async function getBotResponse(userInput, conversationHistory) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const payload = {
        model: 'gpt-3.5-turbo', 
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...conversationHistory,
            { role: 'user', content: userInput }
        ],
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.7
    };

    try {
        console.log("Sending payload to API:", payload);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        console.log("API response status:", response.status);
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error("API Error:", errorDetails);
            return `I'm sorry, I couldn't process your request. (API Error: ${errorDetails.error.message})`;
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            console.log("API response data:", data);
            return data.choices[0].message.content.trim();
        } else {
            console.error("No response choices available");
            return "I'm sorry, I couldn't process your request. (No Choices)";
        }
    } catch (error) {
        console.error("Error fetching response from API:", error);
        return "I'm sorry, I couldn't process your request. (Network Error)";
    }
}

function sendMessage() {
    const inputField = document.getElementById('inputtext');
    const userInput = inputField.value.trim();
    if (userInput === '') return;

    appendMessage('User', userInput);
    inputField.value = '';

    // Keep track of the conversation history
    const chatLog = document.getElementById('chatlog');
    const conversationHistory = Array.from(chatLog.children).map(child => {
        const parts = child.innerHTML.split('</strong>: ');
        return {
            role: parts[0].includes('User') ? 'user' : 'assistant',
            content: parts[1]
        };
    });

    getBotResponse(userInput, conversationHistory).then(botResponse => {
        appendMessage('Chatbot', botResponse);
    });
}

function appendMessage(sender, message) {
    const chatLog = document.getElementById('chatlog');
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}
document.getElementById('inputtext').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

