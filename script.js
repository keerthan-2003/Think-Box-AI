const API_KEY = 'AIzaSyD0EA_UR6P-KWSHxAt8vsB0i2J4M1r_sSQ'; // Replace with your real API key

const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-btn");
const userInput = document.getElementById("user-input");

// Event listeners
sendBtn.addEventListener("click", sendMessage);
clearBtn.addEventListener("click", clearChat);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Append a message to the chat
function appendMessage(text, type) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${type}`;

  const timestamp = document.createElement("span");
  timestamp.className = "timestamp";
  timestamp.textContent = new Date().toLocaleTimeString();

  const textPara = document.createElement("p");
  textPara.textContent = text;

  msgDiv.appendChild(textPara);
  msgDiv.appendChild(timestamp);
  chatBox.appendChild(msgDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Clear chat messages
function clearChat() {
  chatBox.innerHTML = '';
}

// Send the user message and get bot response
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  userInput.value = "";

  const thinkingDiv = document.createElement("div");
  thinkingDiv.className = "message bot loading";
  thinkingDiv.innerText = "Thinking...";
  chatBox.appendChild(thinkingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: text }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    // Remove loading message
    thinkingDiv.remove();

    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    appendMessage(botReply, "bot");

  } catch (error) {
    console.error("API Error:", error);

    thinkingDiv.remove();
    appendMessage("⚠️ Error contacting Gemini API. Please try again later.", "bot error");
  }
}
