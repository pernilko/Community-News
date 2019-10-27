let mysql = require("mysql")

const NyhetssakDao = require("./nyhetssakdao.js");
const runsqlfile = require("./runsqlfile.js");

var pool = mysql.createPool({
  connectionLimit: 1,
  host: "mysql",
  user: "root",
  password: "secret",
  database: "supertestdb",
  debug: false,
  multipleStatements: true
});

let nyhetssakDao = new NyhetssakDao(pool);

beforeAll(done => {
  runsqlfile("server/create_tables.sql", pool, () => {
    runsqlfile("server/create_testdata.sql", pool, done);
  });
});

afterAll(() => {
  pool.end();
});

test("get all articles from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data.length=" + data.length
    );
    expect(data.length).toBeGreaterThanOrEqual(1);
    done();
  }

  nyhetssakDao.getAll(callback);
});


test("get category articles from db", done => {
  function callback(status, data) {
    console.log(
      "Test callback: status=" + status + ", data.length=" + data.length
    );
    expect(data.length).toBeGreaterThanOrEqual(1);
    done();
  }

  nyhetssakDao.getKategori("nyheter", callback);
});
