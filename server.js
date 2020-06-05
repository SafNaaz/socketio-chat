const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "SuNut Bot";

//Run when client connects
io.on("connection", (socket) => {
  //   console.log("New WebSocket Connection");

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Welcome to current user
    socket.emit("message", formatMessage(botName, "Welcome to SuNuT"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );
  });

  //Listen to chatMessage
  socket.on("chatMessage", (msg) => {
    // console.log(msg);
    io.emit("message", formatMessage("USER", msg));
  });

  //Broadcast when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
