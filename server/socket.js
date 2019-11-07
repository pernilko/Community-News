let express = require("express");
let axios = require("axios");
let socketIo = require("socket.io");


let app = express();
let server = app.listen(4001, () => console.log("Listening on port 4001"));

//axios.get('http://localhost:8080/livefeed').then(res => console.log(res.data));

let io = socketIo(server);

let interval;
io.on("connection", socket => {
    console.log("Ny klient tilkoblet");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => 
    getLivefeedAndEmit(socket), 10000);

    socket.on("disconnect", () => {
        console.log("Klient koblet fra");
    });
})

let getLivefeedAndEmit = async socket => {
    try {
        let res = await axios.get('http://localhost:8080/livefeed');
        socket.emit("Livefeed", res.data);
    } catch (error) {
        console.error("Error", error.code);
    }
};

