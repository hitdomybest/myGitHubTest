
var mysql=require("mysql");

/*
var dbObj=mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "mysql",
    database: "userpost"
});
*/

var dbObj=mysql.createConnection({
    host: "127.0.0.1",
    user: "mao",
    password: "userpassword123",
    database: "userpost"
});


module.exports=dbObj;