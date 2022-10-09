const WebSocket = require('ws');
let socket = new WebSocket("wss://metahq.w3work.org");
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider("https://rpc.ankr.com/eth")
);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let posx = 26;
let posy = 33;
let initialMove = false;
const moveSteps = [0, -1, 0, 1, 1, 1, 1, 1, 1];

function generateName(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function generateAddress() {
    const account = web3.eth.accounts.create();
    return account.address;
}

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function userLogin() {
    console.log("User Login");
    const msg = {
        sort: 1001,
        id: 101,
        data: {
            nickname: generateName(randomIntFromInterval(3, 10)),
            headurl: "",
            image: randomIntFromInterval(1, 10),
            address: generateAddress(),
            roomaddress: "",
            roomposx: 0,
            roomposy: 0,
            meeting: "",
            thingroomaddress: "",
            nftname: "",
            nftid: 0
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

function getMoveSteps() {
    const steps = [];
    for (let i = 0; i < 4; i++) {
        const step = moveSteps[randomIntFromInterval(1, 8)];
        const direction = randomIntFromInterval(1, 2);
        if (direction === 1) {
            posx = posx + step
        } else {
            posy = posy + step
        }
        steps.push({x: posx, y: posy})
    }
    return steps
}

function move() {
    console.log("Move")
    const msg = {
        sort: 1002,
        id: 102,
        data: {
            mapid: 102,
            ary:getMoveSteps()
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

socket.onmessage = async function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
    if (JSON.parse(event.data).id === 121) {
        heartBeat();
        if (!initialMove) {
            initialMove = true;
            move();
        }
    }
    if (JSON.parse(event.data).id === 102 && JSON.parse(event.data).data.ary) {
        posx = JSON.parse(event.data).data.ary[0]["x"];
        posy = JSON.parse(event.data).data.ary[0]["y"];
        console.log("sleep")
        await sleep(randomIntFromInterval(3000, 10000));
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