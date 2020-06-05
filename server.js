const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

//Run when client connects
io.on("connection", (socket) => {
  //   console.log("New WebSocket Connection");

  //Welcome to current user
  socket.emit("message", "Welcome to SuNuT");

  //Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  //Broadcast when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
