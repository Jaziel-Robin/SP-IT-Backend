var db = require('./databaseConfig');
var config = require('../config.js');
var jwt = require('jsonwebtoken');
var productDB = {
    addProduct: function (name, description, categoryid, brand, price, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'INSERT INTO product(name,description,categoryid,brand,price) values(?,?,?,?,?)';

                conn.query(sql, [name, description, categoryid, brand, price], function (err, result) {
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
    getProduct: function (pid, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                var sql = 'SELECT p.name,p.description,p.categoryid,c.category,p.brand,p.price FROM sp_it_api.product AS p,sp_it_api.category AS c WHERE p.productid = ? && c.categoryid = p.categoryid';
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
    deleteProduct: function (pid, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'DELETE FROM product WHERE productid=?';

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
    getProducts: function (callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                var sql = 'SELECT productid,name,description,categoryid,brand,price FROM product';
                conn.query(sql, function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
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
                });
            }
        });
    },
    getProductByBrand: function (pBrand, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {

                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected");

                const sql = 'SELECT * FROM product WHERE brand=?';
                dbConn.query(sql, [pBrand], (error, result) => {
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
    },
    searchProductByBrand: function (pBrand, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            pBrand = pBrand + "%";

            if (err) {

                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected");

                const sql = 'SELECT * FROM product WHERE brand LIKE ?';
                dbConn.query(sql, [pBrand], (error, result) => {
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
    },
    searchProductByName: function (pName, callback) {
        
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            pName = "%" + pName + "%";

            if (err) {

                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected");

                const sql = `SELECT * FROM product WHERE name LIKE ?`;
                dbConn.query(sql, [pName], (error, result) => {
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

module.exports = productDB;