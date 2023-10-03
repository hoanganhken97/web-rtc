const io = require("socket.io")(3000);

const userInfo = [];

io.on("connection", (socket) => {
  console.log("on", socket.id);
  socket.on("username_signup", (user) => {
    const isExit = userInfo.some((e) => e.usename === user.usename);
    socket.peer_id = user.peer_id;
    if (isExit) {
      return socket.emit("user_name_exit");
    }
    userInfo.push(user);
    socket.emit("users_online", userInfo);
    socket.broadcast.emit("new_users_online", user);
  });

  socket.on("disconnect", () => {
    const index = userInfo.findIndex((user) => user.peer_id === socket.peer_id);
    userInfo.splice(index, 1);
    io.emit("user_disconnect", socket.peer_id);
  });
});
