
var mysql=require("mysql");

var dbObj=mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "mysql",
    database: "userpost"
});

module.exports=dbObj;