const WebSocket = require('ws');
let socket = new WebSocket("wss://metahq.w3work.org");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let lastX = 26;
let lastY = 33;
const moveSteps = [0, -1, 0, 1];

function generateName(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function generateId(length) {
    return Math.floor(Math.random() * length) + 1;
}

function generateNftId() {
    return Math.floor(Math.random() * 100001);
}


function userLogin() {
    console.log("User Login");
    const msg = {
        sort: 1001,
        id: 101,
        data: {
            nickname: generateName(generateId(10)),
            headurl: "",
            image: generateId(10),
            address: "0xFBF5eA986C83bE81777A975F0E99c54C183dd2A3",
            roomaddress: "",
            roomposx: 0,
            roomposy: 0,
            meeting: "",
            thingroomaddress: "",
            nftname: generateName(generateId(10)),
            nftid: generateNftId()
        }
    };
    socket.send(JSON.stringify(msg));
}

function heartBeat() {
    console.log("heart beat")
    const msg = {
        sort: 1002,
        id: 108,
        data: null
    }
    socket.send(JSON.stringify(msg));
}

function loadMap() {
    console.log("Load Map");
    const msg = {
        sort: 1002,
        id: 101,
        data: null
    }
    socket.send(JSON.stringify(msg));
}

function enterMap() {
    console.log("Enter Map");
    const msg = {
        sort: 1002,
        id: 103,
        data: {
            mapid: 102,
            posx: 26,
            posy: 33
        }
    }
    socket.send(JSON.stringify(msg));
}

function move(posx, posy) {
    console.log("Move")
    const msg = {
        sort: 1002,
        id: 102,
        data: {
            mapid: 102,
            ary:[{x: posx, y: posy}]
        }
    }
    socket.send(JSON.stringify(msg));
}

socket.onopen = async function(e) {
    console.log("[open] Connection established");
    userLogin();
    loadMap();
    enterMap();
};

socket.onmessage = function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
    if (JSON.parse(event.data).id === 121) {
        heartBeat();
        move(lastX + moveSteps[generateId(3)], lastY + moveSteps[generateId(3)]);
    }
    if (JSON.parse(event.data).id === 102 && JSON.parse(event.data).data.ary) {
        lastX = JSON.parse(event.data).data.ary[0]["x"];
        lastY = JSON.parse(event.data).data.ary[0]["y"];
        console.log(lastX)
        console.log(lastY)
    }
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');
    }
};

socket.onerror = function(error) {
    console.log(`[error] ${error.message}`);
};