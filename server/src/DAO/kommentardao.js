// @flow

const Dao = require("./dao.js");

module.exports = class KommentarDao extends Dao {
    getAll(kategori: string, saksId: number, callback: function) {
        super.query(
            "SELECT kommId, kommentar, nick FROM KOMMENTAR JOIN NYHETSSAK ON (KOMMENTAR.saksId = NYHETSSAK.saksID) WHERE NYHETSSAK.kategori=? AND KOMMENTAR.saksId=? ORDER by kommId DESC",
            [kategori, saksId],
            callback
        );
    }

    createOne(saksId: number, json: {kommentar: string, nick: string}, callback: function) {
        super.query(
            "INSERT INTO KOMMENTAR (kommentar, saksId, nick) VALUES (?, ?, ?)",
            [json.kommentar, saksId, json.nick],
            callback
        );
    }

    deleteOne(kommId: number, callback: function) {
        super.query(
            "DELETE FROM KOMMENTAR WHERE KOMMENTAR.kommId=?",
            [kommId],
            callback
        );
    }
};