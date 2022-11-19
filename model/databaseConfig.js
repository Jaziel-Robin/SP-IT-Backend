const mysql = require('mysql');
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            port: [ENTER PORT NUMBER],
            user: {ENTER USER NAME},
            password: [ENTER PASSWORD],
            database: "sp_it_api"
        });
        return conn;
    }
};
module.exports = dbconnect
