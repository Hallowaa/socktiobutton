
const express = require('express');
const app = express();
const http = require('http');

const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

const { MongoClient } = require('mongodb');
const dbName = "test";
const fs = require("fs");
require('dotenv').config();

let uri = process.env.MONGODB_URI;
let port = process.env.PORT || 80;

const client = new MongoClient(uri);
const dataJSON = fs.readFileSync("./data.json");
const data = JSON.parse(dataJSON);

let meowAmount;
let bruhAmount;

app.use("/", express.static("app/public"));



io.on("connection", (socket) => {

    let userInformation = `ID: ${socket.id}  Address: ${socket.request.socket.remoteAddress}`;

    parseDataFromDB();

    io.emit("setMeowValueOnConnect", meowAmount);
    io.emit("setBruhValueOnConnect", bruhAmount);

    console.log(`User has connected ${userInformation}`);

    socket.on("disconnect", () => {
        console.log(`User disconnected ${userInformation}`);
    });

    socket.on("buttonPress", buttonID => {
        
        console.log(`${buttonID} pressed by ${userInformation}`);

        try {
            
            switch(buttonID) {
                case 'meowButton': {
                    meowAmount += 1;
                    data.meowAmount = meowAmount;
                    io.sockets.emit("increaseMeowAmount", meowAmount);
                    updateDataInDB();
                    parseDataFromDB();
                    break;
                }
                case 'bruhButton': {
                    bruhAmount += 1;
                    data.bruhAmount = bruhAmount;
                    io.sockets.emit("increaseBruhAmount", bruhAmount);
                    updateDataInDB();
                    parseDataFromDB();
                    break;
                }
                default: {
                    throw `Error, buttonID: ${buttonID} is not handled`;
                }
            }
        } catch(e) {
            console.error(e);
        }
        
    });
});



async function run() {
    try {
        
        if(client == null) {
            throw "Error, client is null";
        }


        await client.connect();


        await client.db(dbName).command({ping: 1})
        .then(await console.log("Connected successfully to MongoDB"));

    } catch(e) {

        await client.close();
    }
}

function updateDataInDB() {
    try {
        if(client == null) {
            throw "Error, client is null";
        }

        const amountCollection = "Amount";

        client.db(dbName).collection(amountCollection).findOneAndUpdate({ _id: 1 },{ $set: data }, { overwrite:true });

        console.log(`Uploading ${JSON.stringify(data)}`);
            

    } catch(e) {
        console.error(e);
    }
}

async function parseDataFromDB() {
    try {
        if(client == null) {
            throw "Error, client is null";
        }

        const amountCollection = "Amount";

        const amountCollectionContents = await client.db(dbName).collection(amountCollection).findOne({_id: 1});

        fs.writeFileSync("./data.json", JSON.stringify(amountCollectionContents));

        meowAmount = data.meowAmount;
        bruhAmount = data.bruhAmount;

        

        console.log(`Downloading ${JSON.stringify(amountCollectionContents)}`);

    } catch(e) {
        console.error(e);
    }
}

run().catch(console.dir);

server.listen(port, () => console.log(`listening to port ${port}`));