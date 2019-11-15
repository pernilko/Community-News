let express: void = require("express");
let axios: void = require("axios");
let socketIo: void = require("socket.io");


let app: void = express();
let server: void = app.listen(4001, () => console.log("Listening on port 4001"));

//axios.get('http://localhost:8080/livefeed').then(res => console.log(res.data));

let io: void = socketIo(server);

let interval1: number;
io.on("connection", socket => {
    console.log("Ny klient tilkoblet");
    if (interval1) {
        clearInterval(interval1);
    }

    interval1 = setInterval(() => {
        getLivefeedAndEmit(socket: void);
    }, 1000);

    socket.on("disconnect", () => {
        console.log("Klient koblet fra");
    });
})

let getLivefeedAndEmit: void = async socket => {
    try {
        let res: {data: string} = await axios.get('http://localhost:8080/livefeed');
        socket.emit("Livefeed", res.data);
        //console.log(res.data);
    } catch (error) {
        console.error("Error", error.code);
    }
};
