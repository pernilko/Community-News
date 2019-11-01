// @flow

const Dao = require("./dao.js");

module.exports = class NyhetssakDao extends Dao {
    getAll(callback) {
        super.query(
            "SELECT saksId, overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId, rating FROM NYHETSSAK WHERE viktighet=TRUE ORDER BY rating DESC LIMIT 20",
            [],
            callback
        );
    }

    getOneId(kategori, id, callback) {
        super.query(
            "SELECT saksId, overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId, rating FROM NYHETSSAK WHERE kategori=? AND saksId=?",
            [kategori, id],
            callback
        );
    }

    getKategori(kategori, callback) {
        super.query(
            "SELECT saksId, overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId, rating FROM NYHETSSAK WHERE viktighet=FALSE AND kategori=? ORDER BY rating DESC",
            [kategori],
            callback
        );
    }

    createOne(json, callback) {
        super.query(
            "INSERT INTO NYHETSSAK (overskrift, innhold, tidspunkt, bilde, kategori, viktighet, rating, brukerId) VALUES (?, ?, NOW(), ?, ?, ?, 0, ?)",
            [json.overskrift, json.innhold, json.bilde, json.kategori, json.viktighet, json.brukerId],
            callback
        );
    }

    deleteOne(id, callback) {
        super.query(
            "DELETE FROM NYHETSSAK WHERE NYHETSSAK.saksId=?",
            [id],
            callback
        );
    }

    upvote(id, callback) {
        super.query(
            "UPDATE NYHETSSAK SET RATING = RATING + 1 WHERE NYHETSSAK.saksId=?",
            [id],
            callback
        );
    }

    getLivefeed(callback) {
        super.query(
            "SELECT overskrift FROM NYHETSSAK WHERE NYHETSSAK.viktighet=FALSE AND TIMESTAMPDIFF(MINUTE, NOW(), NYHETSSAK.tidspunkt) <= 60 ORDER BY NYHETSSAK.tidspunkt DESC LIMIT 5",
            [],
            callback
        );
    }

    updateSak(id, json, callback) {
        super.query(
            "UPDATE NYHETSSAK SET NYHETSSAK.overskrift=?, NYHETSSAK.innhold=?, NYHETSSAK.bilde=?, NYHETSSAK.tidspunkt=NOW(), NYHETSSAK.kategori=?, NYHETSSAK.viktighet=? WHERE NYHETSSAK.saksId = ?",
            [json.overskrift, json.innhold, json.bilde, json.kategori, json.viktighet, id],
            callback
        );
    }
};