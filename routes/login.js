  
var User = require("../lib/user");

exports.showLoginForm=function(req,res){

	 res.render("login",{title:"Login"});
};

exports.doUserLogin=function(req,res,next){
     var bodyData = req.body;
     User.authenticate(bodyData.user_name, bodyData.user_pass, function(err, user){
          if (err){
          	  return next(err);
          }

          if (user){
          	  req.session.uid = user.userid;
          	  req.session.uname = user.username;
          	  res.redirect("/");
          } else {
          	  res.error("Sorry, invalid credentials.");
          	  res.redirect("back");
          }
     });
};

exports.doUserLogout=function(req,res){
     req.session.destroy(function(err){
         if (err){
         	 throw err;
         }
         res.redirect("/");
     });
};