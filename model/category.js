var db = require('./databaseConfig');
var config = require('../config.js');
var jwt = require('jsonwebtoken');
var categoryDB = {
    addCategory: function (cat, description, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'INSERT INTO category(category,description) values(?,?)';

                conn.query(sql, [cat, description], function (err, result) {
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
    getCategories: function (callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = "SELECT categoryid,category,description  FROM category";

                conn.query(sql, function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        var arrayOfCat = [];
                        for (var i = 0; i < result.length; i++) {
                            let catInfoData = {
                                categoryid: result[i].categoryid,
                                category: result[i].category,
                                description: result[i].description
                            }
                            arrayOfCat.push(catInfoData);
                        }

                        let finalResult = {
                            catInfo: arrayOfCat
                        }

                        // return callback(null, result);
                        return callback(null, finalResult);
                    }

                });
            }
        })
    },
    getProductByCat: function (cid, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {

                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected");

                const sql = 'SELECT * FROM product WHERE categoryid=?';
                dbConn.query(sql, [cid], (error, result) => {
                    dbConn.end();
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        if (result.length === 0) {
                            // no user found, nothing to do
                            return callback(null, null);

                        } else {

                            // compile critical info to return
                            var arrayOfInfo = [];
                            for (var i = 0; i < result.length; i++) {
                                let productInfoData = {
                                    productid: result[i].productid,
                                    name: result[i].name,
                                    description: result[i].description,
                                    categoryid: result[i].categoryid,
                                    brand: result[i].brand,
                                    price: result[i].price
                                }
                                arrayOfInfo.push(productInfoData);
                            }

                            let finalResult = {
                                productInfo: arrayOfInfo
                            }

                            // return callback(null, result);
                            return callback(null, finalResult);
                        }
                    }

                });
            }
        });
    }
}

module.exports = categoryDB;