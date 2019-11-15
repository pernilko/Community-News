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

describe('Empty test', () => {
  it('1 equals 1', done => {
    expect(1).toEqual(1);
    done();
  });
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
});