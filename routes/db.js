var mysql = require('mysql');
var config = require('./config');

var pool = mysql.createPool({
    connectionLimit: 50,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.dbport   
});

var connection = function(callback){
    pool.getConnection(function(err, conn){
        if (err){
            conn.release();
            callback(err, null);
            return;
        }
        else{
            callback(null, conn);
            return;
        }
    });
    
}

//module.exports = connection;
exports.connection = connection;