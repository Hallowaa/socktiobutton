const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
require('dotenv').config();
const io = new Server(server);
const mongo = require('mongodb').MongoClient;

let port = process.env.PORT || 80;

mongo.connect(process.env.MONGODBKEY, (err, db) => {
    if(err) {
        console.log("Could not connect to MongoDB");
        throw err;
    }

    console.log("MongoDB connected.");
})

app.use("/", express.static("app/public"));

io.on("connection", (socket) => {

    let userInformation = `ID: ${socket.id}  Address: ${socket.request.socket.remoteAddress}`

    console.log(`User has connected ${userInformation}`);

    socket.on("disconnect", () => {
        console.log(`User disconnected ${userInformation}`);
      });

    socket.on("buttonPress", () => {
        console.log(`Button pressed by ${userInformation}`);
        
    });
    socket.on("increaseMeowAmount", () => {
        
    })
});

server.listen(port, () => console.log(`listening to port ${port}`));