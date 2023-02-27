const WebSocket = require('ws');
// let socket = new WebSocket("wss://wxgame.qweiyou.com:5745");   // 阿杜服
// let socket = new WebSocket("wss://metahq.w3work.org");    // Testnet
let socket = new WebSocket("wss://metahq.w3.work");  // Mainnet
const Web3 = require('web3');
const web3 = new Web3(
    new Web3.providers.HttpProvider("https://rpc.ankr.com/eth")
);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let posx = 50;
let posy = 40;
let userId = "";
const maxPosx = 100;
const maxPosy = 70;
const minPos = 5;
let iteration = 0;
let hitBound = 1;
let enteredRoom = false;
let enteredMap = false;
let initialMove = false;
const moveStep1 = [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [1, -1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1]];
const moveStep2 = [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [1, -1], [1, 1], [1, 1], [1, 1], [1, 1], [1, 1]];
const moveStep3 = [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [1, -1], [1, 0], [1, 0], [1, 0], [1, 0], [1, 0]];
const moveStep4 = [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [1, -1], [1, -1], [1, -1], [1, -1], [1, -1], [1, -1]];
const moveStep5 = [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [1, -1], [0, -1], [0, -1], [0, -1], [0, -1], [0, -1]];
const moveStep6 = [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]];
const moveStep7 = [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [1, -1], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]];
const moveStep8 = [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [1, -1], [-1, 1], [-1, 1], [-1, 1], [-1, 1], [-1, 1]];
const moveStep9 = [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [1, -1], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
const moveSteps = [moveStep1, moveStep2, moveStep3, moveStep4, moveStep5, moveStep6, moveStep7, moveStep8, moveStep9]



function generateName(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function generateNFTNames() {
    const names = ["BAYC", "Doodles", "Mfers", "MoonBirds", "", "", "", ""]
    return names[randomIntFromInterval(0, 7)]
}

function generateNFTIds() {
    return randomIntFromInterval(1, 1000)
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
            nftname: generateNFTNames(),
            nftid: generateNFTIds(),
        }
    };
    socket.send(JSON.stringify(msg));
}

function heartBeat() {
    //console.log("heart beat")
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

function enterRoom() {
    console.log("Enter Room");
    const msg = {
        sort: 1002,
        id: 103,
        data: {
            mapid: 1001,
            posx,
            posy
        }
    }
    socket.send(JSON.stringify(msg));
}

function getMoveSteps() {
    const nextSteps = [];
    for (let i = 0; i < 4; i++) {
        const steps = moveSteps[(Number(userId) + iteration) % 9];
        const step = steps[randomIntFromInterval(0, 11)];
        posx += step[0]
        posy += step[1]
        if (posx >= maxPosx) {
            posx = maxPosx;
            hitBound += 1;
        }
        if (posx <= minPos) {
            posx = minPos
            hitBound += 1;
        }
        if (posy >= maxPosy) {
            posy = maxPosy;
            hitBound += 1;
        }
        if (posy <= minPos) {
            posy = minPos
            hitBound += 1;
        }
        if (hitBound % 10 === 0) {
            hitBound += 1;
            iteration += 1;
        }
        nextSteps.push({x: posx, y: posy})
    }
    return nextSteps
}

function move() {
    //console.log("Move")
    const msg = {
        sort: 1002,
        id: 102,
        data: {
            mapid: 1001,
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
    // console.log(`[message] Data received from server: ${event.data}`);
    if (JSON.parse(event.data).id === 121) {
        heartBeat();
        if (enteredMap && !enteredRoom) {
            enterRoom();
        }
        if (enteredRoom && !initialMove) {
            initialMove = true;
            console.log("initial move")
            move();
        }
    }
    if (JSON.parse(event.data).id === 201) {
        userId = JSON.parse(event.data).data.id;
    }
    if (JSON.parse(event.data).id === 104 && JSON.parse(event.data).data.targetmap === 1001 && JSON.parse(event.data).data.userid === userId) {
        enteredRoom = true;
    }
    if (JSON.parse(event.data).id === 103 && JSON.parse(event.data).data.mapid === 102 && JSON.parse(event.data).data.userid === userId) {
        enteredMap = true;
    }
    if (JSON.parse(event.data).id === 102 && JSON.parse(event.data).data.ary && JSON.parse(event.data).data.userid === userId) {
        posx = JSON.parse(event.data).data.ary[0]["x"];
        posy = JSON.parse(event.data).data.ary[0]["y"];
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