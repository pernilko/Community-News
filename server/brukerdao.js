// @flow

const Dao = require("./dao.js");

module.exports = class BrukerDao extends Dao {
    getOne(brukernavn, callback) {
        super.query(
            "SELECT brukerId, brukernavn FROM BRUKER WHERE brukernavn=?",
            [brukernavn],
            callback
        );
    }
}