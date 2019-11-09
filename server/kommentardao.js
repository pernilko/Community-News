const Dao = require("./dao.js");

module.exports = class KommentarDao extends Dao {
    getAll(kategori, saksId, callback) {
        super.query(
            "SELECT kommId, kommentar, nick FROM KOMMENTAR JOIN NYHETSSAK ON (KOMMENTAR.saksId = NYHETSSAK.saksID) WHERE NYHETSSAK.kategori=? AND KOMMENTAR.saksId=?",
            [kategori, saksId],
            callback
        );
    }

    createOne(saksId, json, callback) {
        super.query(
            "INSERT INTO KOMMENTAR (kommentar, saksId, nick) VALUES (?, ?, ?)",
            [json.kommentar, saksId, json.nick],
            callback
        );
    }

    deleteOne(kommId, callback) {
        super.query(
            "DELETE FROM KOMMENTAR WHERE KOMMENTAR.kommId=?",
            [kommId],
            callback
        );
    }
};