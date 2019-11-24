// @flow

let mysql = require("mysql");

const Brukerdao = require("../src/DAO/brukerdao.js");
const runsqlfile = require("../src/DAO/runsqlfile.js");

let pool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql",
    user: "root",
    password: "secret",
    database: "supertestdb",
    debug: false,
    multipleStatements: true
});

let brukerdao = new Brukerdao(pool);

test("get one user from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].brukernavn).toBe("bruker");
    done();
  }
  

  brukerdao.getOne("bruker", callback);
}, 30000);