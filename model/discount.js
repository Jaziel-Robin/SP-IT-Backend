var db = require('./databaseConfig');
var config = require('../config.js');
var jwt = require('jsonwebtoken');
var discountDB = {
    addDiscount: function (pid, discount, discount_start_date, discount_end_date, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'INSERT INTO discount(fk_productid, discount, discount_start_date, discount_end_date) values(?,?,?,?)';

                conn.query(sql, [pid, discount, discount_start_date, discount_end_date], function (err, result) {
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
    deleteDiscount: function (pid, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'DELETE FROM discount WHERE fk_productid=?';

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
    },
    deleteByDiscountId: function (did, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'DELETE FROM discount WHERE discountid=?';

                conn.query(sql, [did], function (err, result) {
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
    getDiscount: function (pid, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                var sql = 'SELECT * FROM discount WHERE fk_productid=?';
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

module.exports = discountDB;