var async = require('async');
var bcrypt = require('bcrypt-node');
var mysql = require('./db');

var Users = [];

var User = function(){
    userId = null;
    email = null;
    name = null;
    password = null;
    activated = true;
    
}


User.prototype.setUserId = function(value){
    userId = value;
}

User.prototype.setEmail= function(value){
    email = value;
}

User.prototype.setName = function(value){
    name = value;
}

User.prototype.setPassword = function(value){
    password = value;
}


//=============================================
//Get's
User.prototype.getUserId = function(){
    return userId;
}

User.prototype.getEmail= function(){
    return email;
}

User.prototype.getName = function(){
    return name;
}

User.prototype.getPassword = function(){
    return password;
}

User.prototype.getActivated = function(){
    return activated;
}


User.prototype.toString = function(){
    return "Email: " + email + " Name: " + name + " wachtwoord: " + password;
}



User.login = function(email, password, callback){  

    var userQuery = "select id from User where email = ? && activated = 1;";
    var wwQuery = "select * from Password where userID = ? && Pw = ?;";
    mysql.connection(function(err, conn){
        if(err){ return callback(err); }
        var userID = null;
        rows = null;
        conn.query(userQuery, [email], function(err, rows){
            if(err){
                return callback(err);
            }else{
                if(rows[0] == null){
                    return callback("BAD E-MAIL", null);
                }
                userID = rows[0].id;
                console.log("USERID: " + userID);
                rows = null;
                conn.query(wwQuery,[userID, password], function(err,rows){
                    if(err){
                        return callback(err);
                    }else{
                        console.log(rows);
                        if(rows[0] == null){
                            return callback("BAD LOGIN", null);
                        }
                        return callback(null, true);
                    }
                })
            }
        })
    })
}

User.register = function(object, callback){    
    user = object;
    var sqlcount = "select * from User";
    var sqluser = "insert into User(id, naam, email, activated) values (?,?,?,0)";
    var sqlpassword = "insert into Password() values (?,?)";
    
    
    mysql.connection(function(err, conn){
        if(err){ return callback(err); }
        conn.query(sqlcount, function(err, rows){
            if(err){
                return callback(err);
            }else{
                user.setUserId(rows.length);    
                rows = null;
                conn.query(sqluser,[user.getUserId(), user.getName(), user.getEmail()],function(err,rows){
                    if(err){
                        return callback(err);
                    }else{
                        //console.log(rows.length);
                        //return callback(null, true)
                        rows = null;
                        conn.query(sqlpassword,[user.getUserId(), user.getPassword()],function(err,rows){
                            if(err){
                                return callback(err);
                            }else{
                                //console.log(rows.length);
                                return callback(null, true);
                            }
                        })
                    }
                })
                //return callback(null, true);
            }
        })
    })
}

User.activate = function(mail, callback){  

    var activateQuery = "UPDATE User set activated = 1 where email = ?;";
    mysql.connection(function(err, conn){
        if(err){ return callback(err); }
        
        conn.query(activateQuery, [mail], function(err, rows){
            if(err){
                return callback(err);
            }else{
                mail = null;
                return callback(null, true);
            }
        })
    })
}

User.insertEnquette = function(email, beroep, kinderen, proctype, callback){    
    var sqlcount = "select * from Enquette";
    var sqlUserId = "select id from User where email = ?";
    var sqlEnquette = "insert into Enquette(id, userID, beroep, aatalKinderen, ProcType) values (?,?,?,?,?)";   
    mysql.connection(function(err, conn){
        if(err){ return callback(err); }
        conn.query(sqlcount, function(err, rows){
            if(err){
                return callback(err);
            }else{
                var enquetteID = rows.length;    
                rows = null;
                conn.query(sqlUserId,[email],function(err,rows){
                    if(err){
                        return callback(err);
                    }else{
                        var userID = rows.length - 1;
                        rows = null;
                        conn.query(sqlEnquette,[enquetteID, userID, beroep, kinderen, proctype],function(err,rows){
                            if(err){
                                return callback(err);
                            }else{
                                //console.log(rows.length);
                                return callback(null, true);
                            }
                        })
                    }
                })
                //return callback(null, true);
            }
        })
    })
}

module.exports = User;