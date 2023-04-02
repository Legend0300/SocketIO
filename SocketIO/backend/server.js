const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http , {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
        }
        });

        const userIO = io.of('/user');

        userIO.use((socket, next) => {
            const username = socket.handshake.auth.username;
            if (!username) {
                return next(new Error('invalid username'));
            }
            socket.username = username;
            next();
        });
        
        
        userIO.on('connection', (socket) => {
            console.log('a user connected with id: ' + socket.id + ' and username: ' + socket.username);
        });
        
        userIO.on("ping", (n) => {
            n = 1;
            console.log(n);
        });


        io.on('connection', (socket) => {
            console.log('a person connected with id: ' + socket.id);
        
            socket.on("join-room", (room) => {
                socket.join(room);
                console.log('user ' + socket.id + ' joined room: ' + room);
            });
        
            socket.on("chat-message", (msg , room) => {
                if(room === "")
                {
                    console.log('message: ' + msg);
                    socket.broadcast.emit('rec-message', msg);
                }
                else
                {
                    console.log('message: ' + msg);
                    socket.to(room).emit('rec-message', msg);
                }
            });


            socket.on("join-room", (room , cb) => {
                socket.join(room);
                cb(`You have joined room: ${room}`);
            });

        })
        
        


http.listen(3000, () => {
    console.log('listening on *:3000');
});