const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');
const dataFileName = './data.json';
const dataFile = require(dataFileName);

let dataFileContent = fs.readFileSync(dataFileName);
let content = JSON.parse(dataFileContent);
let meows = content.value;

let port = process.env.PORT || 80;


app.use("/", express.static("app/public"));

io.on("connection", (socket) => {

    let userInformation = `ID: ${socket.id}  Address: ${socket.request.socket.remoteAddress}`

    console.log(`User has connected ${userInformation}`);
    io.emit("updateMeowAmountCounter", meows);


    socket.on("disconnect", () => {
        console.log(`User disconnected ${userInformation}`);
      });

    socket.on("buttonPress", () => {
        console.log(`Button pressed by ${userInformation}`);
        
    });
    socket.on("increaseMeowAmount", () => {
        meows += 1;
        content.value = meows;
        fs.writeFileSync(dataFileName, JSON.stringify(content, null, 4));
        io.emit("updateMeowAmountCounter", meows);
    })
});

server.listen(port, () => console.log(`listening to port ${port}`));