const API_KEY = 'AIzaSyD0EA_UR6P-KWSHxAt8vsB0i2J4M1r_sSQ'; // Replace this
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function appendMessage(text, type) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${type}`;
  msgDiv.innerText = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  userInput.value = "";

  appendMessage("Thinking...", "bot");

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
    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";
    
    // Remove "Thinking..." message
    const botThinking = document.querySelector(".bot:last-child");
    if (botThinking) botThinking.remove();

    appendMessage(botReply, "bot");
  } catch (error) {
    console.error(error);
    appendMessage("Error contacting Gemini API.", "bot");
  }
}
