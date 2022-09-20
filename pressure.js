const WebSocket = require('ws');
let socket = new WebSocket("wss://alpha.w3.work/");

function sendMessage() {
    // Construct a msg object containing the data the server needs to process the message from the chat client.
    const msg = {
        sort: 1001,
        id: 101,
        data: {
            nickname: "Cuegod",
            headurl: "",
            image: 2,
            address: "0x21A8652b81adb2420477Ccd3D156002E43D1BbD3",
            roomaddress: "",
            roomposx: "",
            roomposy: "",
            meeting: "",
            thingroomaddress: "",
            nftname: "Cuegod",
            nftid: 6
        }
    };

    // Send the msg object as a JSON-formatted string.
    socket.send(JSON.stringify(msg));

}

socket.onopen = function(e) {
    console.log("[open] Connection established");
    console.log("Sending to server");
    sendMessage();
};

socket.onmessage = function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
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