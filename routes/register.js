
var User = require("../lib/user");

exports.showRegisterForm=function(req, res){
    
    var message={type:"info",string:"mmmmssssggggg"};

    res.locals.messages.push(message);
    
    req.session.messages = res.locals.messages;
    
    console.log(" step: 1;");

	res.render("register",{title:"Register"});
}

exports.doUserRegister=function(req, res, next){
	//res.send("User register finished.");
	//res.render("registercomplete");
	
	var bodyData = req.body;
    
    //console.log(req.body.user_name);
    
    //res.redirect("back");
    
    console.log(" step: 2;");
    
	User.getUserInfoByName(bodyData.user_name, function(err, user){
         
         console.log(" step: 5;");

         if (err){
         	return next(err);
         } 

         /*
         if (user.userid){
         	 res.error("Username already taken!");
         	 res.redirect("back");
         }  else {
         	 user = new User({
                 username: bodyData.user_name,
                 userpw: bodyData.user_pass,
                 userage: 33
         	 });

             user.save(function(err){
                 if (err){
                 	 return next(err);
                 }
                 
                 req.session.uid = user.userid;
                 res.redirect("/");
             });

         }
         */
        
         /*
         if(user==null){
         	 user = new User({
                 username: bodyData.user_name,
                 userpw: bodyData.user_pass,
                 userage: 43
         	 });

             user.save(function(err){
                 if (err){
                 	 return next(err);
                 }

                 req.session.uid = user.userid;
                 res.redirect("/register/showForm");
             });
         } else if (user.userid){
         	 res.error("Username already taken!");
         	 res.redirect("back");
         }
         */
         
         var ifNewUser=false;
         if (user==null){
             ifNewUser=true;
         } else if (user.userid){
         	 ifNewUser=false;
         }

         //console.log(ifNewUser);

         if(ifNewUser==true){
         	console.log(" step: 6;");
         	user = new User({
                 username: bodyData.user_name,
                 userpw: bodyData.user_pass,
                 userage: 43
         	});

         } else if (ifNewUser==false){
         	console.log("not new user");
         	res.error("Username already taken!");
         	res.redirect("back");
         	return;
         }
         
         /*
         console.log("new user");
         res.redirect("back");
         return; 
         */
         
         console.log(" step: 7;");

         user.save(function(err){
                 if (err){
                 	 return next(err);
                 }
                 console.log("new user");
                 req.session.uid = user.userid;
                 res.redirect("back");
         });
	});
    
}