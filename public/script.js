// client-side
const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const roomContainer = document.getElementById("room-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");

if (messageForm != null) {
  // so no message form before joining room
  const name = prompt("What is your name?");
  appendMessage("You joined");
  socket.emit("new-user", roomName, name);

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent form from sending post request to server (also no refresh)
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit("send-chat-message", roomName, message);
    messageInput.value = "";
  });
}

// add new room on home page
socket.on("room-created", (room) => {
  /*
  <div class="room">
    <div><%= room %></div>
    <a href="/<%= room %>">Join</a> 
  </div>
  */
  const roomElement = document.createElement("div");
  roomElement.innerText = room;
  const roomLink = document.createElement("a");
  roomLink.href = `/${room}`;
  roomLink.innerText = "join";
  const roomDiv = document.createElement("div");
  roomDiv.classList.add("room");
  roomDiv.append(roomElement);
  roomDiv.append(roomLink);
  roomContainer.append(roomDiv);
});

socket.on("chat-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on("user-connected", (name) => {
  appendMessage(`${name} connected`);
});

socket.on("user-disconnected", (name) => {
  appendMessage(`${name} disconnected`);
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
