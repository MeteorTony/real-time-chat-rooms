// server-side
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
});

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

httpServer.listen(3000, () => {
  console.log("listening on port 3000");
});

/*
    above: server initialization
    below: socket connection and handling
*/

const users = {}; // store all user names with their unique id as key

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });
  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
