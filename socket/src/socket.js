// @flow

let express: function = require("express");
let axios: function = require("axios");
let socketIo: function = require("socket.io");


let app: function = express();
let server: function = app.listen(4001, () => console.log("Listening on port 4001"));

let io: function = socketIo(server);

let interval1: IntervalID;
io.on("connection", socket => {
    console.log("Ny klient tilkoblet");
    if (interval1) {
        clearInterval(interval1);
    }

    interval1 = setInterval(() => {
        getLivefeedAndEmit(socket);
    }, 1000);

    socket.on("disconnect", () => {
        console.log("Klient koblet fra");
    });
})

let getLivefeedAndEmit = async socket => {
    try {
        let res = await axios.get('http://localhost:8080/livefeed');
        socket.emit("Livefeed", res.data);
        //console.log(res.data);
    } catch (error) {
        console.error("Error", error.code);
    }
};
