// @flow

const Dao = require("./dao.js");

module.exports = class NyhetssakDao extends Dao {
    getAll(callback: function) {
        super.query(
            "SELECT saksId, overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId, rating FROM NYHETSSAK WHERE viktighet=TRUE ORDER BY rating DESC LIMIT 20",
            [],
            callback
        );
    }

    getOneId(kategori: string, id: number, callback: function) {
        super.query(
            "SELECT saksId, overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId, rating FROM NYHETSSAK WHERE kategori=? AND saksId=?",
            [kategori, id],
            callback
        );
    }

    getKategori(kategori: string, callback: function) {
        super.query(
            "SELECT saksId, overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId, rating FROM NYHETSSAK WHERE viktighet=FALSE AND kategori=? ORDER BY rating DESC LIMIT 20",
            [kategori],
            callback
        );
    }

    createOne(json: {overskrift: string, innhold: string, bilde: string, kategori: string, viktighet: boolean, rating: number, brukerId: number}, callback: function) {
        super.query(
            "INSERT INTO NYHETSSAK (overskrift, innhold, tidspunkt, bilde, kategori, viktighet, rating, brukerId) VALUES (?, ?, NOW(), ?, ?, ?, 0, ?)",
            [json.overskrift, json.innhold, json.bilde, json.kategori, json.viktighet, json.brukerId],
            callback
        );
    }

    deleteOne(id: number, callback: function) {
        super.query(
            "DELETE FROM NYHETSSAK WHERE NYHETSSAK.saksId=?",
            [id],
            callback
        );
    }

    upvote(id: number, callback: function) {
        super.query(
            "UPDATE NYHETSSAK SET RATING = RATING + 1 WHERE NYHETSSAK.saksId=?",
            [id],
            callback
        );
    }

    downvote(id: number, callback: function) {
        super.query(
            "UPDATE NYHETSSAK SET RATING = RATING - 1 WHERE NYHETSSAK.saksId=?",
            [id],
            callback
        );
    }

    getLivefeed(callback: function) {
        super.query(
            "SELECT overskrift, tidspunkt, saksId, kategori FROM NYHETSSAK WHERE NYHETSSAK.viktighet=0 ORDER BY NYHETSSAK.tidspunkt DESC LIMIT 3",
            [],
            callback
        );
    }

    updateSak(id: number, json: {overskrift: string, innhold: string, bilde: string, kategori: string, viktighet: boolean, id: number}, callback: function) {
        super.query(
            "UPDATE NYHETSSAK SET NYHETSSAK.overskrift=?, NYHETSSAK.innhold=?, NYHETSSAK.bilde=?, NYHETSSAK.tidspunkt=NOW(), NYHETSSAK.kategori=?, NYHETSSAK.viktighet=? WHERE NYHETSSAK.saksId = ?",
            [json.overskrift, json.innhold, json.bilde, json.kategori, json.viktighet, id],
            callback
        );
    }

    getSakerBruker(id: number, callback: function) {
        super.query(
            "SELECT saksId, overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId, rating FROM NYHETSSAK WHERE NYHETSSAK.brukerId=? ORDER BY rating DESC",
            [id],
            callback
        );
    }

    getForfatter(id: number, callback: function) {
        super.query(
            "SELECT brukernavn FROM BRUKER JOIN NYHETSSAK ON (BRUKER.brukerId = NYHETSSAK.brukerId) WHERE NYHETSSAK.saksId=?",
            [id],
            callback
        );
    }

    getSokSak(overskrift: string, callback: function) {
        super.query(
            "SELECT saksId, overskrift, innhold, tidspunkt, bilde, kategori, viktighet, brukerId, rating FROM NYHETSSAK WHERE overskrift LIKE ?",
            ["%"+overskrift+"%"],
            callback
        );
    }
};