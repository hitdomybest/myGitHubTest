

var User = require("../lib/user");

exports.showRegisterForm=function(req, res){
    
    var message={type:"info",string:"mmmmssssggggg"};

    res.locals.messages.push(message);
    
    req.session.messages = res.locals.messages;

	res.render("register",{title:"Register"});
}

exports.doUserRegister=function(req, res, next){

	var bodyData = req.body;

	User.getUserInfoByName(bodyData.user_name, function(err, user){

         if (err){
         	return next(err);
         } 

         var ifNewUser=false;
         if (user==null){
             ifNewUser=true;
         } else if (user.userid){
         	 ifNewUser=false;
         }

         if(ifNewUser==true){

            var randomAge=Math.ceil(Math.random()*100);

         	user = new User({
                 username: bodyData.user_name,
                 userpw: bodyData.user_pass,
                 userage: randomAge
         	});

         } else if (ifNewUser==false){
         	res.error("Username already taken!");
         	res.redirect("back");
         	return;
         }

         //user.saveUserInfo(req,res,"/register/showRegisterForm",user.setUserInfo);
         user.saveUserInfo(req,res,"/",user.setUserInfo);

	});
    
}