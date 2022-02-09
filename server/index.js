const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('C:/Users/d4n1e/bruh/app/public'));

io.on('connection', (socket) => {

    let userInformation = `ID: ${socket.id}  Address: ${socket.request.socket.remoteAddress}`

    console.log(`User has connected ${userInformation}`);

    socket.on('disconnect', () => {
        console.log(`User disconnected ${userInformation}`);
      });

    socket.on("buttonPress", () => {
        console.log(`Button pressed by ${userInformation}`);
    });
});

server.listen(80, () => console.log('listening on port 80'));