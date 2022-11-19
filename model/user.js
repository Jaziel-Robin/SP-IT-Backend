var db = require('./databaseConfig');
var config = require('../config.js');
var jwt = require('jsonwebtoken');
var userDB = {
    loginUser: function (username, password, callback) {

        var dbConn = db.getConnection();
        dbConn.connect(function (err) {

            if (err) {

                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected");

                const sql = `SELECT * FROM user WHERE username = ? AND password = ?;`;
                dbConn.query(sql, [username, password], (error, results) => {
                    dbConn.end();
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        if (results.length === 0) {
                            // no user found, nothing to do
                            return callback(null, null);

                        } else {
                            // it must be that we have ONE result here

                            //since the email is unique
                            console.log(`Secret Key: ${config.key}`);

                            // generates the token

                            var token = jwt.sign(
                                // {1} Payload
                                {
                                    id: results[0].userid,
                                    role: results[0].role
                                },
                                // {2} Secret Key
                                config.key,
                                // {3} Lifespan of Token
                                {
                                    // expires in a day
                                    expiresIn: 84600 // in seconds
                                }

                            );

                            // compile critical info to return
                            let userInfoData = {
                                ci_userid: results[0].userid,
                                ci_username: results[0].username,
                                ci_email: results[0].email,
                                ci_role: results[0].type,
                                ci_pic: results[0].profile_pic_url,

                            }

                            let finalResult = {
                                f_token: token,
                                f_userInfo: userInfoData,
                            }

                            return callback(null, finalResult);
                        }
                    }

                });
            }
        });
    },
    addUser: function (username, email, contact, password, /*type, profile_pic_url,*/ callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'INSERT INTO user(username,email,contact,password) values(?,?,?,?)';

                conn.query(sql, [username, email, contact, password], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);

                    } else {

                        console.log(result.insertId);

                        return callback(null, result.insertId);

                    }
                });

            }

        });

    },
    getUsers: function (callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = "SELECT userid,username,email,contact,type,profile_pic_url,created_at FROM user";

                conn.query(sql, function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }

                });
            }
        })
    },
    getUser: function (userid, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");
                var sql = 'SELECT userid,username,email,contact,type,profile_pic_url,created_at FROM user WHERE userid = ?';
                conn.query(sql, [userid], function (err, result) {
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
    updateUser: function (username, email, contact, password, type, profile_pic_url, uid, callback) {

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'UPDATE user SET username=?,email=?,contact=?,password=?,type=?,profile_pic_url=? WHERE userid=?';

                conn.query(sql, [username, email, contact, password, type, profile_pic_url, uid], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log(err);
                        return callback(err, null);

                    } else {

                        console.log(result.affectedRows);

                        return callback(null, result.affectedRows);

                    }
                });

            }

        });
    }
}

module.exports = userDB;