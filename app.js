var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var methodOverride=require("method-override");
var cookieParser=require("cookie-parser");
var session=require("express-session");

var index = require('./routes/index');
//var users = require('./routes/users');
var users = require('./routes/users1');

//var register = require('./routes/register');
var register = require('./routes/register1');

var login = require('./routes/login');

var Entry = require("./lib/entry");

var messages=require("./lib/messages");

var usermiddleware=require("./lib/middleware/usermiddleware");

var validatemiddleware=require("./lib/middleware/validate");

var pagermiddleware=require("./lib/middleware/pager");

var entries=require("./routes/entries");

var api = require("./routes/api");

var httperrorstatus = require("./routes/httperrorstatus");

var app = express();

var port=4010;
app.set("port", port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/

app.use(methodOverride());

app.use(cookieParser("111111"));

app.use(session({secret:"222222"}));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", api.auth);

app.use(usermiddleware);

app.use(messages);

app.use(entries.initialTable);

app.get("/",users.showDefaultPage);

app.get("/register/showRegisterForm",register.showRegisterForm);

app.post("/register/doRegister",register.doUserRegister);


app.get("/loginout/showLoginForm", login.showLoginForm);

app.post("/loginout/doLogin", login.doUserLogin);

app.get("/loginout/doLogout", login.doUserLogout);

app.get("/post/showPostForm",entries.showPostForm);

//app.post("/post/doPost",entries.doUserPost);

app.post("/post/doPost", validatemiddleware.required("entry_title"), validatemiddleware.lengthAbove("entry_title",6), entries.doUserPost);

//app.get("/post/showEntriesList", entries.showEntriesList);

app.get("/post/showEntriesList", pagermiddleware(Entry.getEntriesCount, 3), entries.showEntriesList);

//app.get("/post/showEntriesList/:page?", pagermiddleware(Entry.getEntriesCount, 2), entries.showEntriesList);


app.get("/api/getUserById/:userid", api.getUserDataById);

//app.post("/api/addNewEntry", entries.doUserPost);

app.post("/api/addNewEntry", validatemiddleware.required("entry_title"), validatemiddleware.lengthAbove("entry_title",6), entries.doUserPost);

app.get("/api/getEntriesList/:page?", pagermiddleware(Entry.getEntriesCount, 4), api.getEntriesList);

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/

/*
// set ERROR_ROUTE=1:* & node app
*/

if (process.env.ERROR_ROUTE){
    app.get("/dev/error", function(req, res, next){
        var err = new Error("Database connection failed.");
        err.type ="database";
        next(err);
    });
}


/*
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/

app.use(httperrorstatus.notfound);

app.use(httperrorstatus.fivehundrederror);

module.exports = app;

var http=require("http");
var httpServer=http.createServer(app);

/*
httpServer.listen(app.get("port"), function(){
        console.log("This http server based on express is listening on port "+app.get("port"));
});
*/

var db=require("./models/dbObj");

var sqlStatement = "CREATE TABLE IF NOT EXISTS users (" 
                 + "userid INT(10) NOT NULL AUTO_INCREMENT, " 
                 + "username varchar(50) DEFAULT '', " 
                 + "userpw varchar(100) DEFAULT '', "
                 + "userage INT(10) NOT NULL default 0, " 
                 + "pwsalt varchar(50) DEFAULT '', " 
                 + "PRIMARY KEY(userid))";
    
db.query(sqlStatement,function(err){
      if (err){
          throw err;
      }

      httpServer.listen(app.get("port"), function(){
           console.log("This http server based on express is listening on port "+app.get("port"));
      });

});
