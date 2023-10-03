const socket = io("http://localhost:3000", { transports: ["websocket"] });

$("#chat-room").hide();

socket.on("users_online", (userInfo) => {
  $("#chat-room").show();
  $("#sign-up").hide();

  userInfo.forEach((user) => {
    const { usename, peer_id } = user;
    $("#id-user").append(`<li id="${peer_id}">${usename}</li>`);
  });

  socket.on("new_users_online", (user) => {
    const { usename, peer_id } = user;
    $("#id-user").append(`<li id="${peer_id}">${usename}</li>`);
  });

  socket.on("user_disconnect", (peer_id) => {
    $(`#${peer_id}`).remove();
  });
});

socket.on("user_name_exit", () => {
  alert("Vui long chon username khac!");
});
function openStream() {
  const config = { audio: false, video: true };
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}

// openStream().then((stream) => {
//   playStream("localStream", stream);
//   console.log(3, stream);
// });
const peer = new Peer();
// const peer = new Peer({
//   host: "9000-peers-peerjsserver-nm18mnrbf52.ws-us105.gitpod.io",
//   port: 9000,
//   path: "/myapp",
//   secure: true,
// });

peer.on("open", (id) => {
  $("#my-peer").append(id);
  $("#btn-signup").click(() => {
    const usename = $("#username").val();
    socket.emit("username_signup", { usename: usename, peer_id: id });
  });
});

// caller
$("#btn-call").click(() => {
  const id = $("#remote-id").val();
  openStream().then((stream) => {
    playStream("local-stream", stream);
    const call = peer.call(id, stream);
    call.on("stream", (remoteStream) =>
      playStream("remote-stream", remoteStream)
    );
  });
});
//callee
peer.on("call", (call) => {
  openStream().then((stream) => {
    call.answer(stream);
    playStream("local-stream", stream);
    call.on("stream", (remoteStream) =>
      playStream("remote-stream", remoteStream)
    );
  });
});

$("#id-user").on("click", "li", function () {
  const id = $(this).attr("id");

  openStream().then((stream) => {
    playStream("local-stream", stream);
    const call = peer.call(id, stream);
    call.on("stream", (remoteStream) =>
      playStream("remote-stream", remoteStream)
    );
  });
});
