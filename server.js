// server-side
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],     // go to localhost:3000 as main page
  },
});

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // can use URL encoded parameters inside form

const rooms = {};

app.get("/", (req, res) => {
  res.render("index", { rooms: rooms });
});

// room creation
app.post("/room", (req, res) => {
  if (rooms[req.body.room] != null) {       // check if the room already exists -> back to home page
    return res.redirect("/");
  }
  rooms[req.body.room] = { users: {} };     // store all user names (with their unique id as key) in a room
  res.redirect(req.body.room);
  io.emit("room-created", req.body.room);   // send message that new room was created
});

app.get("/:room", (req, res) => {
  if (rooms[req.params.room] == null) {     // if room not exist -> back to home page
    return res.redirect("/");
  }
  res.render("room", { roomName: req.params.room });
});

httpServer.listen(3000, () => {
  console.log("listening on port 3000");
});

/*
    above: server initialization
    below: socket connection and handling
*/

io.on("connection", (socket) => {
  socket.on("new-user", (room, name) => {
    socket.join(room);
    rooms[room].users[socket.id] = name;
    socket.broadcast.to(room).emit("user-connected", name);
  });
  socket.on("send-chat-message", (room, message) => {
    socket.broadcast.to(room).emit("chat-message", {                // only send message to user inside that room
      message: message,
      name: rooms[room].users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    getUserRooms(socket).forEach(room => {
        socket.broadcast.to(room).emit("user-disconnected", rooms[room].users[socket.id]);
        delete rooms[room].users[socket.id];          
    })
  });
});

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {      // object -> array -> a single value (names array)
      if (room.users[socket.id] != null) names.push(name)
      return names
    }, [])
  }