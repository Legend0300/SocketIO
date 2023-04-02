const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http , {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
        }
        });

io.on('connection', (socket) => {

    socket.on("new-user", (name) => {
        socket.broadcast.emit("user-connected", name);
        console.log(name + " connected");
    });

    socket.on("send-chat-message", (message , name) => {
        socket.broadcast.emit("chat-message", message , name);
    }
    );


    socket.on("disconnect", (name) => {
        socket.broadcast.emit("user-disconnected" , name);
    });

});



http.listen(3000, () => {
    console.log('listening on *:3000');
});
