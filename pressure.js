const WebSocket = require('ws');
let socket = new WebSocket("wss://metahq.w3work.org");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function userLogin() {
    const msg = {
        sort: 1001,
        id: 101,
        data: {
            nickname: "Cuegod",
            headurl: "",
            image: 2,
            address: "0xFBF5eA986C83bE81777A975F0E99c54C183dd2A3",
            roomaddress: "",
            roomposx: 0,
            roomposy: 0,
            meeting: "",
            thingroomaddress: "",
            nftname: "Cuegod",
            nftid: 6
        }
    };
    socket.send(JSON.stringify(msg));
}

function heartBeat() {
    const msg = {
        sort: 1002,
        id: 108,
        data: null
    }
    socket.send(JSON.stringify(msg));
}

function loadMap() {
    const msg = {
        sort: 1002,
        id: 101,
        data: null
    }
    socket.send(JSON.stringify(msg));
}

function enterMap() {
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

function move() {
    const msg = {
        sort: 1002,
        id: 102,
        data: {
            mapid: 102,
            x: 27,
            y: 33
        }
    }
    socket.send(JSON.stringify(msg));
}

socket.onopen = async function(e) {
    console.log("[open] Connection established");
    console.log("User Login");
    userLogin();
    console.log("Load Map");
    loadMap();
    console.log("Enter Map");
    enterMap();
};

socket.onmessage = function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
    if (JSON.parse(event.data).id === 121) {
        console.log("heart beat!")
        heartBeat();
        move();
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