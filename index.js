
const express = require('express');
const app = express();
const http = require('http');

const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

const { MongoClient } = require('mongodb');
const mongo = require('mongodb').MongoClient;

require('dotenv').config();

let uri = process.env.MONGODB_URI;
let port = process.env.PORT || 80;

const client = new MongoClient(uri);

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

async function run() {
    try {
      // Connect the client to the server
      await client.connect();

      // Establish and verify connection
      await client.db("admin").command({ ping: 1 });
      console.log("Connected successfully to server");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

run().catch(console.dir);

server.listen(port, () => console.log(`listening to port ${port}`));