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

    getOneId(kategori: string, id: string, callback: void) {
        super.query(
            "SELECT saksId, overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId, rating FROM NYHETSSAK WHERE kategori=? AND saksId=?",
            [kategori, id],
            callback
        );
    }

    getKategori(kategori: string, callback: void) {
        super.query(
            "SELECT saksId, overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId, rating FROM NYHETSSAK WHERE viktighet=FALSE AND kategori=? ORDER BY rating DESC",
            [kategori],
            callback
        );
    }

    createOne(json: {overskrift: string, innhold: string, bilde: string, kategori: string, viktighet: Boolean, rating: number, brukerId: number}, callback: void) {
        super.query(
            "INSERT INTO NYHETSSAK (overskrift, innhold, tidspunkt, bilde, kategori, viktighet, rating, brukerId) VALUES (?, ?, NOW(), ?, ?, ?, 0, ?)",
            [json.overskrift, json.innhold, json.bilde, json.kategori, json.viktighet, json.brukerId],
            callback
        );
    }

    deleteOne(id: string, callback: void) {
        super.query(
            "DELETE FROM NYHETSSAK WHERE NYHETSSAK.saksId=?",
            [id],
            callback
        );
    }

    upvote(id: string, callback: void) {
        super.query(
            "UPDATE NYHETSSAK SET RATING = RATING + 1 WHERE NYHETSSAK.saksId=?",
            [id],
            callback
        );
    }

    downvote(id: string, callback: void) {
        super.query(
            "UPDATE NYHETSSAK SET RATING = RATING - 1 WHERE NYHETSSAK.saksId=?",
            [id],
            callback
        );
    }

    getLivefeed(callback: void) {
        super.query(
            "SELECT overskrift, tidspunkt FROM NYHETSSAK WHERE NYHETSSAK.viktighet=0 ORDER BY NYHETSSAK.tidspunkt DESC LIMIT 5",
            [],
            callback
        );
    }

    updateSak(id: number, json: {overskrift: string, innhold: string, bilde: string, kategori: string, viktighet: Boolean, id: number}, callback: void) {
        super.query(
            "UPDATE NYHETSSAK SET NYHETSSAK.overskrift=?, NYHETSSAK.innhold=?, NYHETSSAK.bilde=?, NYHETSSAK.tidspunkt=NOW(), NYHETSSAK.kategori=?, NYHETSSAK.viktighet=? WHERE NYHETSSAK.saksId = ?",
            [json.overskrift, json.innhold, json.bilde, json.kategori, json.viktighet, id],
            callback
        );
    }

    getSakerBruker(id: string, callback: void) {
        super.query(
            "SELECT saksId, overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId, rating FROM NYHETSSAK WHERE NYHETSSAK.brukerId=? ORDER BY rating DESC",
            [id],
            callback
        );
    }
};
