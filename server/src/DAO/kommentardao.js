// @flow

const Dao = require("./dao.js");

module.exports = class KommentarDao extends Dao {
    getAll(kategori: string, saksId: string, callback: void) {
        super.query(
            "SELECT kommId, kommentar, nick FROM KOMMENTAR JOIN NYHETSSAK ON (KOMMENTAR.saksId = NYHETSSAK.saksID) WHERE NYHETSSAK.kategori=? AND KOMMENTAR.saksId=? ORDER by kommId DESC",
            [kategori, saksId],
            callback
        );
    }

    createOne(saksId: string, json: {kommentar: string, nick: string}, callback: void) {
        super.query(
            "INSERT INTO KOMMENTAR (kommentar, saksId, nick) VALUES (?, ?, ?)",
            [json.kommentar, saksId, json.nick],
            callback
        );
    }

    deleteOne(kommId: string, callback: void) {
        super.query(
            "DELETE FROM KOMMENTAR WHERE KOMMENTAR.kommId=?",
            [kommId],
            callback
        );
    }
};