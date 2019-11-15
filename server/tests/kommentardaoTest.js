// @flow

let mysql = require("mysql");

const Kommentardao = require("../src/DAO/kommentardao.js");
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

let kommentardao = new Kommentardao(pool);

beforeAll(done => {
  runsqlfile("create_tables.sql", pool, () => {
    runsqlfile("create_testdata.sql", pool, done);
  });
});

test("get all comments from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].kommentar).toBe("kommentar");
    done();
  }

  kommentardao.getAll("Nyheter", 1, callback);
}, 30000);

test("add comment to db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }

  kommentardao.createOne(1,
    { kommentar: "kommentar2", nick: "bruker2"},
    callback
  );
}, 30000);

test("get new comments from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(2);
    done();
  }

  kommentardao.getAll("Nyheter", 1, callback);
}, 30000);

test("delete comment from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }

  kommentardao.deleteOne(2, callback);
}, 30000);