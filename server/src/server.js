let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let server = app.listen(8080);
let fs = require("fs");
let path = require("path");
var exec = require('child_process').exec, child;

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
    next();
});

app.post("/code", (req, res) => {
    console.log("Got POST-request from client");
    let s = req.body.code;
    fs.writeFile("test.cpp", s, () => {
        exec('docker build -t cpp . && docker run cpp', (error, stdout, stderr) => {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            res.json({"data": stdout});
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    });
});



