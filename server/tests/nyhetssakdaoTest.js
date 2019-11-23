// @flow

let mysql = require("mysql");

const Nyhetssakdao = require("../src/DAO/nyhetssakdao.js");
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

let nyhetssakdao = new Nyhetssakdao(pool);

beforeAll(done => {
  runsqlfile("create_tables.sql", pool, () => {
    runsqlfile("create_testdata.sql", pool, done);
  });
});

afterAll(() => {
  pool.end();
});

test("get all articles from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe("overskrift");
    done();
  }

  nyhetssakdao.getAll(callback);
}, 30000);

test("get one article from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe("overskrift");
    done();
  }

  nyhetssakdao.getOneId("Nyheter", 1, callback);
}, 30000);

test("get one category article from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(0);
    done();
  }

  nyhetssakdao.getKategori("Nyheter", callback);
}, 30000);

test("add article to db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }

  nyhetssakdao.createOne(
    { overskrift: "overskrift2", innhold: "innhold2", bilde: "bilde.jpg", kategori: "Sport", viktighet: false, rating: 0, brukerId: 1},
    callback
  );
}, 30000);

test("get new article from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    console.log(data.saksId);
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe("overskrift2");
    done();
  }

  nyhetssakdao.getKategori("Sport", callback);
}, 30000);

test("upvote one article in db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBe(1);
    done();
  }

  nyhetssakdao.upvote(1, callback);
}, 30000);

test("get article rating from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].rating).toBe(1);
    done();
  }

  nyhetssakdao.getOneId("Nyheter", 1, callback);
}, 30000);

test("downvote one article in db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBe(1);
    done();
  }

  nyhetssakdao.downvote(1, callback);
}, 30000);

test("get article rating from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].rating).toBe(0);
    done();
  }

  nyhetssakdao.getOneId("Nyheter", 1, callback);
}, 30000);

test("get livefeed from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe("overskrift2");
    done();
  }

  nyhetssakdao.getLivefeed(callback);
}, 30000);

test("update one article in db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBe(1);
    done();
  }

  nyhetssakdao.updateSak(15,
    { overskrift: "overskrift3", innhold: "innhold2", bilde: "bilde.jpg", kategori: "Sport", viktighet: false, id: 15},
    callback
  );
}, 30000);

test("get updated article from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe("overskrift3");
    done();
  }

  nyhetssakdao.getKategori("Sport", callback);
}, 30000);

test("get user article from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(2);
    expect(data[0].overskrift).toBe("overskrift");
    done();
  }

  nyhetssakdao.getSakerBruker(1, callback);
}, 30000);

test("deleting one article from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.affectedRows).toBe(1);
    done();
  }

  nyhetssakdao.deleteOne(15, callback);
}, 30000);

test("get deleted article from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(0);
    done();
  }

  nyhetssakdao.getKategori("Sport", callback);
}, 30000);

test("get author from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].brukernavn).toBe("bruker");
    done();
  }

  nyhetssakdao.getForfatter(1, callback);
}, 30000);

test("get search-result from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data=" + JSON.stringify(data)
    );
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe("overskrift");
    done();
  }

  nyhetssakdao.getSokSak("skr", callback);
}, 30000);