var db = require('./databaseConfig');
var config = require('../config.js');
var jwt = require('jsonwebtoken');
var interestDB = {
    addInterest: function (uid, cidArr, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                for (var i = 0; i < cidArr.length; i++) {
                    var sql = 'INSERT INTO interest(fk_userid, fk_categoryid) values(?,?)';
                    conn.query(sql, [uid, cidArr[i]], function (err, result) {
                        if (err) {
                            console.log(err);
                            return callback(err, null);

                        } else {

                            return callback(null, result);

                        }
                    });
                }
                conn.end();
            }
        });

    }
}

module.exports = interestDB;