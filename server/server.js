let express = require("express");
let mysql = require("mysql");
let bodyParser = require("body-parser");
let bcrypt = require("bcryptjs");
let socket = require("socket.io");
let jwt = require("jsonwebtoken");
let fs = require("fs");
let app = express();
const NyhetssakDao = require("./nyhetssakdao.js");
const KommentarDao = require("./kommentardao.js");

app.use(bodyParser.json()); // for å tolke JSON i body

let rawconfig = fs.readFileSync("config.json");
let config = JSON.parse(rawconfig);

let privateKey = (publicKey = config.key);

let pool = mysql.createPool({
	connectionLimit: 2,
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database,
	debug: false
});

let nyhetssakDao = new NyhetssakDao(pool);
let kommentarDao = new KommentarDao(pool);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
    next();
});


app.use("/api", (req, res, next) => {
	var token = req.headers["x-access-token"];
	jwt.verify(token, publicKey, (err, decoded) => {
		if (err) {
			console.log("Token IKKE ok");
			res.status(401);
			res.json({ error: "Not authorized" });
		} else {
			console.log("Token ok: " + decoded.brukernavn);
			next();
		}
	});
});

app.post("/login", (req, res) => {
	pool.getConnection((err, connection) => {
		if (err) {
			console.log("Feil ved kobling til databasen");
			res.json({ error: "feil ved oppkobling" });
		} else {
			connection.query(
				"SELECT passord FROM BRUKER WHERE brukernavn=?",
				[req.body.brukernavn],
				(err, rows) => {
					connection.release();
					if (err) {
						console.log(err);
						res.status(500);
						res.json({ error: "Feil ved insert" });
					} else {
						if (bcrypt.compareSync(req.body.passord, rows[0].passord)) {
							console.log("Brukernavn & passsord ok");
							let token = jwt.sign({ brukernavn: req.body.brukernavn }, privateKey, {
								expiresIn: 1800
							});
							res.json({ jwt: token });
						} else {
							console.log("Brukernavn & passord ikke ok");
							res.status(401);
							res.json({ error: "Not authorized "});
						}
					}
				}
			)
		}
	});
});

app.post("/registrer", (req, res) => {
	console.log("Fikk POST-request fra klienten");
	//console.log("Brukernavn: " + req.body.brukernavn);
	//console.log("Passord: " + req.body.passord);
	pool.getConnection((err, connection) => {
		if (err) {
			console.log("Feil ved oppkobling");
			res.json({ error: "feil ved oppkobling" });
		} else {
			console.log("Fikk databasekobling");
			const brukernavn = req.body.brukernavn;
			const passord = req.body.passord;
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(passord, salt, function(err, hash) {
					connection.query(
						"INSERT INTO BRUKER (brukernavn, passord) values (?, ?)",
						[brukernavn, hash],
						err => {
							if (err) {
								console.log(err);
								res.status(500);
								res.json({ error: "Feil ved insert" });
							} else {
								console.log("insert ok");
								res.send("");
							}
						}
					);
				});
			});
		}
	});
});

app.post("/token", (req, res) => {
	let token = req.headers["x-access-token"];
	jwt.verify(token, publicKey, (err, decoded) => {
		if (err) {
			console.log(err);
			console.log("Token IKKE ok");
			res.status(401);
			res.json({ error: "Not authorized" });
		} else {
			token = jwt.sign({ brukernavn: req.body.brukernavn}, privateKey, {
				expiresIn: 1800
			});
			res.json({ jwt: token });
		}
	});
});


app.get("/nyhetssaker", (req, res) => {
	console.log("/api/nyhetssaker: Fikk GET-request fra klienten");
    nyhetssakDao.getAll((status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/nyhetssaker/:kategori", (req, res) => {
	console.log("/api/nyhetssaker/:kategori: Fikk GET-request fra klient");
    nyhetssakDao.getKategori(req.params.kategori, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/nyhetssaker/:kategori/:saksId", (req, res) => {
    console.log("/api/nyhetssaker/:kategori/:id: Fikk GET-request fra klient");
    nyhetssakDao.getOneId(req.params.kategori, req.params.saksId, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/nyhetssaker", (req, res) => {
    console.log("/api/nyhetssaker: Fikk POST-request fra klient");
    nyhetssakDao.createOne(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.delete("/nyhetssaker/:saksId", (req, res) => {
	console.log("/api/nyhetssaker/: Fikk DELETE-request fra klienten");
    pool.getConnection((err, connection) => {
        console.log("Connected to database");
        if (err) {
            console.log("Feil ved kobling til databasen");
            res.json({ error: "feil ved oppkobling" });
        } else {
            connection.query(
				"DELETE FROM KOMMENTAR WHERE KOMMENTAR.saksId=?",
				[req.params.saksId],
				(err, rows) => {
					//connection.release();
					if (err) {
						console.log(err);
						res.json({ error: "error querying" });
					} else {
						connection.query(
							"DELETE FROM NYHETSSAK WHERE saksId=?",
							[req.params.saksId],
							(err, rows) => {
								if (err) {
									console.log("feil ved sletting av artikkel");
								}
								else {
									console.log("sletting av artikkel fullført");
									res.send("sletting av artikkel fullført");
								}
								connection.release();
							}
						)
					}
				}
			);
        }
    });
});

app.put("/nyhetssaker/:saksId", (req, res) => {
    console.log("api/nyhetssaker/:saksId: Fikk PUT-request fra klienten");
    nyhetssakDao.upvote(req.params.saksId, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/livefeed", (req, res) => {
    console.log("api/livefeed: Fikk GET-request fra klienten");
    nyhetssakDao.getLivefeed((status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/nyhetssaker/:kategori/:saksId/kommentarer", (req, res) => {
	console.log("/api/nyhetssaker/:kategori/:saksId/kommentarer: Fikk GET-request fra klient");
    kommentarDao.getAll(req.params.kategori, req.params.saksId, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/nyhetssaker/:saksId", (req, res) => {
    console.log("/api/nyhetssaker/:saksId: Fikk POST-request fra klient");
    kommentarDao.createOne(req.params.saksId, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.put("/nyhetssaker/rediger/:saksId", (req, res) => {
	console.log("/api/nyhetssaker/saksId: Fikk PUT-request fra klient");
	nyhetssakDao.updateSak(req.params.saksId, req.body, (status, data) => {
		res.status(status);
		res.json(data);
	})
});

let server = app.listen(8080);