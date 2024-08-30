const app = document.querySelector(".app"),
  joinScreen = app.querySelector(".join-screen"),
  chatScreen = app.querySelector(".chat-screen"),
  joinInput = app.querySelector(".join-screen #userName"),
  joinBtn = app.querySelector(".join-screen #join-btn"),
  exitBtn = app.querySelector(".chat-screen #exit-btn"),
  messageContainer = app.querySelector(".chat-screen .messages"),
  messageInput = app.querySelector(".chat-screen #message"),
  sendBtn = app.querySelector(".chat-screen #send-btn");
const socket = io();

let uName = "";
joinInput.focus();

// Join chat
joinBtn.addEventListener("click", () => {
  const userName = joinInput.value;
  if (userName.length == 0) {
    return;
  }
  socket.emit("join", userName);
  uName = userName;
  joinScreen.classList.remove("active");
  chatScreen.classList.add("active");
  joinInput.value = "";
  messageInput.focus();
});

joinScreen.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    joinBtn.click();
  }
});

// Exit chat
exitBtn.addEventListener("click", () => {
  socket.emit("exit", uName);
  window.location.href = window.location.href;
});

// Send message
sendBtn.addEventListener("click", () => {
  const message = messageInput.value;
  if (message.length == 0) {
    return;
  }
  renderMessage("sent", {
    name: uName,
    content: message,
  });
  socket.emit("chat", {
    name: uName,
    content: message,
  });
  messageInput.value = "";
});

chatScreen.addEventListener("keyup", (event) => {
  if (event.key == "Enter") {
    sendBtn.click();
  }
  if (event.key == "Escape") {
    exitBtn.click();
  }
});

// Render messages
const renderMessage = (type, message) => {
  if (type == "sent") {
    const messageElement = document.createElement("div");
    messageElement.setAttribute("class", "message sent");
    messageElement.innerHTML = `
            <div>
                <div class="name">You</div>
                <div class="content">${message.content}</div>
            </div>
        `;
    messageContainer.appendChild(messageElement);
  } else if (type == "received") {
    const messageElement = document.createElement("div");
    messageElement.setAttribute("class", "message received");
    messageElement.innerHTML = `
            <div>
                <div class="name">${message.name}</div>
                <div class="content">${message.content}</div>
            </div>
        `;
    messageContainer.appendChild(messageElement);
  } else if (type == "status") {
    const messageElement = document.createElement("div");
    messageElement.setAttribute("class", "status");
    messageElement.innerText = message;
    messageContainer.appendChild(messageElement);
  }
  messageContainer.scrollTop =
    messageContainer.scrollHeight - messageContainer.clientHeight;
};

// Handle status and chat messages from the server
socket.on("status", (status) => {
  renderMessage("status", status);
});

socket.on("chat", (message) => {
  renderMessage("received", message);
});
