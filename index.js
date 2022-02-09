const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let port = process.env.PORT || 80

app.use("/", express.static("app/public"));

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

server.listen(port, () => console.log(`listening to port ${port}`));