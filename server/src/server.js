let express = require("express");
let mysql = require("mysql");
let bodyParser = require("body-parser");
let bcrypt = require("bcryptjs");
let socket = require("socket.io");
let jwt = require("jsonwebtoken");
//let cors = require("cors");
let fs = require("fs");
let app = express();

app.use(bodyParser.json()); // for å tolke JSON i body

//app.use(cors());

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


app.get("/api/nyhetssaker", (req, res) => {
	console.log("Fikk request fra klienten");
	pool.getConnection((err, connection) => {
		console.log("Connected to database");
		if (err) {
			console.log("Feil ved kobling til databasen");
			res.json({ error: "feil ved oppkobling" });
		} else {
			connection.query(
				"SELECT overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId FROM NYHETSSAK",
				(err, rows) => {
					connection.release();
					if (err) {
						console.log(err);
						res.json({ error: "error querying" });
					} else {
						console.log(rows);
						res.json(rows);
					}
				}
			);
		}
	});
});

app.get("/api/nyhetssaker/:kategori", (req, res) => {
	console.log("Fikk request fra klient");
	pool.getConnection((err, connection) => {
		console.log("Connected to database");
		if (err) {
			console.log("Feil ved kobling til databasen");
			res.json({ error: "feil ved oppkobling" });
		} else {
			connection.query(
				"SELECT overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId FROM NYHETSSAK WHERE kategori=?",
				[req.params.kategori],
				(err, rows) => {
					connection.release();
					if (err) {
						console.log(err);
						res.json({ error: "error querying" });
					} else {
						console.log(rows);
						res.json(rows);
					}
				}
			);
		}
	});
});

app.get("/api/nyhetssaker/:kategori/:saksId", (req, res) => {
	console.log("Fikk request fra klient");
	pool.getConnection((err, connection) => {
		console.log("Connected to database");
		if (err) {
			console.log("Feil ved kobling til databasen");
			res.json({ error: "feil ved oppkobling" });
		} else {
			connection.query(
				"SELECT overskrift, innhold, tidspunkt, bilde, kategori, brukerId FROM NYHETSSAK WHERE NYHETSSAK.kategori=? AND NYHETSSAK.saksId=?",
				[req.params.kategori, req.params.saksId],
				(err, rows) => {
					connection.release();
					if (err) {
						console.log(err);
						res.json({ error: "error querying" });
					} else {
						console.log(rows);
						res.json(rows);
					}
				}
			);
		}
	});
});

app.post("/api/nyhetssaker", (req, res) => {
	console.log("Fikk POST-request fra klienten");
	console.log("Overskrift: " + req.body.overskrift);
	console.log("Innhold: " + req.body.innhold);
	console.log("Tidspunkt: " + req.body.tidspunkt);
	console.log("Kategori: " + req.body.kategori);
	console.log("Viktighet: " + req.body.viktighet);
	console.log("Bruker-ID: " + req.body.brukerId);
	pool.getConnection((err, connection) => {
		if (err) {
			console.log("Feil ved oppkobling");
			res.json({ error: "feil ved oppkobling" });
		} else {
			console.log("Fikk databasekobling");
			let val = [req.body.overskrift, req.body.innhold, req.body.kategori, req.body.viktighet, req.body.brukerId];
			connection.query(
				"INSERT INTO NYHETSSAK (overskrift, innhold, tidspunkt, kategori, viktighet, brukerId) values (?, ?, NOW(), ?, ?, ?)",
				val,
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
		}
	});
});

app.delete("/api/nyhetssaker/:saksId", (req, res) => {
	console.log("Fikk DELETE-request fra klienten");
	pool.getConnection((err, connection) => {
		if (err) {
			console.log("Feil ved oppkobling");
			res.json({ error: "feil ved oppkobling" });
		} else {
			console.log("Fikk databasekobling");

			connection.query(
				"DELETE FROM NYHETSSAK WHERE NYHETSSAK.saksId=? AND NYHETSSAK.brukerId = (SELECT BRUKER.brukerId FROM BRUKER WHERE BRUKER.brukernavn=?)",
				[req.params.saksId, req.body.brukernavn],
				err => {
					if (err) {
						console.log(err);
						res.status(500);
						res.json({ error: "Feil ved delete" });
					} else {
						console.log("delete ok");
						res.send("");
					}
				}
			);
		}
	});
});

app.get("/api/nyhetssaker/:kategori/:saksId/kommentarer", (req, res) => {
	console.log("Fikk request fra klient");
	console.log(req.params.saksId);
	pool.getConnection((err, connection) => {
		console.log("Connected to database");
		if (err) {
			console.log("Feil ved kobling til databasen");
			res.json({ error: "feil ved oppkobling" });
		} else {
			connection.query(
				"SELECT kommentar, nick from KOMMENTAR JOIN NYHETSSAK ON (KOMMENTAR.saksId = NYHETSSAK.saksID) WHERE NYHETSSAK.kategori=? AND KOMMENTAR.saksId=?",
				[req.params.kategori, req.params.saksId],
				(err, rows) => {
					connection.release();
					if (err) {
						console.log(err);
						res.json({ error: "error querying" });
					} else {
						console.log(rows);
						res.json(rows);
					}
				}
			);
		}
	});
});

app.post("/api/nyhetssaker/:saksId/kommentarer", (req, res) => {
	console.log("Fikk POST-request fra klienten");
	console.log("Forfatter: " + req.body.forfatter);
	console.log("Kommentar: " + req.body.kommentar);
	console.log("Saks-ID: " + req.body.saksId);
	pool.getConnection((err, connection) => {
		if (err) {
			console.log("Feil ved oppkobling");
			res.json({ error: "feil ved oppkobling" });
		} else {
			console.log("Fikk databasekobling");
			let val = [req.body.forfatter, req.body.kommentar, req.params.saksId];
			connection.query(
				"INSERT INTO KOMMENTAR (forfatter, kommentar, saksId) values (?, ?, ?)",
				val,
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
		}
	});
});

app.post("/api/nyhetssaker/:saksId/ratinger", (req, res) => {
	console.log("Fikk POST-request fra klienten");
	console.log("Rating: " + req.body.rating);
	console.log("Saks-ID: " + req.body.saksId);
	pool.getConnection((err, connection) => {
		if (err) {
			console.log("Feil ved oppkobling");
			res.json({ error: "feil ved oppkobling" });
		} else {
			console.log("Fikk databasekobling");
			let val = [req.body.rating, req.params.saksId];
			connection.query(
				"INSERT INTO RATING (rating, saksId) values (?, ?)",
				val,
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
		}
	});
});

app.get("/api/brukere", (req, res) => {
	console.log("Fikk request fra klient");
	pool.getConnection((err, connection) => {
		console.log("Connected to database");
		if (err) {
			console.log("Feil ved kobling til databasen");
			res.json({ error: "feil ved oppkobling" });
		} else {
			connection.query(
				"SELECT brukernavn, passord from BRUKER",
				(err, rows) => {
					connection.release();
					if (err) {
						console.log(err);
						res.json({ error: "error querying" });
					} else {
						console.log(rows);
						res.json(rows);
					}
				}
			);
		}
	});
});

app.get("/api/brukere/:brukerId", (req, res) => {
	console.log("Fikk request fra klient");
	pool.getConnection((err, connection) => {
		console.log("Connected to database");
		if (err) {
			console.log("Feil ved kobling til databasen");
			res.json({ error: "feil ved oppkobling" });
		} else {
			connection.query(
				"SELECT brukernavn, passord from BRUKER WHERE BRUKER.brukerId=?",
				[req.params.brukerId],
				(err, rows) => {
					connection.release();
					if (err) {
						console.log(err);
						res.json({ error: "error querying" });
					} else {
						console.log(rows);
						res.json(rows);
					}
				}
			);
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

app.get("/api/livefeed", (req, res) => {
	console.log("Fikk request fra klient");
	pool.getConnection((err, connection) => {
		console.log("Connected to database");
		if (err) {
			console.log("Feil ved kobling til databasen");
			res.json({ error: "feil ved oppkobling" });
		} else {
			connection.query(
				"SELECT overskrift, tidspunkt FROM NYHETSSAK WHERE NYHETSSAK.viktighet=2 AND TIMESTAMPDIFF(MINUTE, NOW(), tidspunkt) <= 60 LIMIT 5 ORDER BY tidspunkt DESC",
				(err, rows) => {
					connection.release();
					if (err) {
						console.log(err);
						res.json({ error: "error querying" });
					} else {
						console.log(rows);
						res.json(rows);
					}
				}
			);
		}
	});
});

let server = app.listen(8080);
