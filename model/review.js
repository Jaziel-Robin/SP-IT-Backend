var db = require('./databaseConfig');
var config = require('../config.js');
var jwt = require('jsonwebtoken');
var reviewDB = {
    addReview: function (userid, pid, rating, productReview, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'INSERT INTO review(userid,productid,rating,review) values(?,?,?,?)';

                conn.query(sql, [userid, pid, rating, productReview], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);

                    } else {

                        return callback(null, result);

                    }
                });

            }

        });

    },
    getReviews: function (pid, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                var sql = 'SELECT r.productid, r.userid, u.username, r.rating, r.review, r.created_at FROM sp_it_api.user AS u, sp_it_api.review AS r WHERE r.userid = u.userid AND r.productid=?';
                conn.query(sql, [pid], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                });
            }
        });
    }
}

module.exports = reviewDB;