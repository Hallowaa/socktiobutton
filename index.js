
const express = require('express');
const app = express();
const http = require('http');

const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

const { MongoClient } = require('mongodb');
const dbName = "test";
require('dotenv').config();

let uri = process.env.MONGODB_URI;
let port = process.env.PORT || 80;

const client = new MongoClient(uri);

let meowAmount;
let bruhAmount;
let loveAmount;

app.use("/", express.static("app/public"));


io.on("connection", (socket) => {

    let userInformation = `ID: ${socket.id}  Address: ${socket.request.socket.remoteAddress}`;

    console.log(`User has connected ${userInformation}`);

    io.emit("setMeowValueOnConnect", meowAmount);
    io.emit("setBruhValueOnConnect", bruhAmount);
    io.emit("setLoveValueOnConnect", loveAmount);

    socket.on("disconnect", () => {
        console.log(`User disconnected ${userInformation}`);
    });

    socket.on("buttonPress", buttonID => {
        
        console.log(`${buttonID} pressed by ${userInformation}`);

        try {
            
            switch(buttonID) {
                case 'meowButton': {
                    meowAmount += 1;
                    io.sockets.emit("increaseMeowAmount", meowAmount);
                    updateDataInDB();
                    break;
                }
                case 'bruhButton': {
                    bruhAmount += 1;
                    io.sockets.emit("increaseBruhAmount", bruhAmount);
                    updateDataInDB();
                    break;
                }
                case 'loveButton': {
                    loveAmount += 1;
                    io.sockets.emit("increaseLoveAmount", loveAmount);
                    updateDataInDB();
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
        .then(
            console.log("Connected successfully to MongoDB"),
            updateLocalData(parseDataFromDB()));

    } catch(e) {

        await client.close();
    }
}

function updateDataInDB() {
    try {
        if(client == null) {
            throw "Error, client is null";
        }

        data = {"_id": 1, "meowAmount": meowAmount, "bruhAmount": bruhAmount, "loveAmount": loveAmount};

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

        console.log(`Downloading ${JSON.stringify(amountCollectionContents)}`);

        return amountCollectionContents;

    } catch(e) {
        console.error(e);
    }
}

async function updateLocalData(amountCollectionContents) {
    newData = await amountCollectionContents;

    meowAmount = newData.meowAmount;
    bruhAmount = newData.bruhAmount;
    loveAmount = newData.loveAmount;
}

run().catch(console.dir);

server.listen(port, () => console.log(`listening to port ${port}`));