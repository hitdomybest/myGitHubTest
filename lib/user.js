
var bcrypt=require("bcrypt");

var dbObj=require("../models/dbObj");

module.exports = User;

/*
function User(obj){
	
	for (var key in obj){
	     this[key]=obj[key];
	}
	
    var sqlStatement = "CREATE TABLE IF NOT EXISTS users (" 
                     + "userid INT(10) NOT NULL AUTO_INCREMENT, " 
                     + "username varchar(50) DEFAULT '', " 
                     + "userpw varchar(100) DEFAULT '', "
                     + "userage INT(10) NOT NULL default 0, " 
                     + "pwsalt varchar(50) DEFAULT '', " 
                     + "PRIMARY KEY(userid))";
    
    dbObj.query(sqlStatement,function(err){
          if (err){
          	  throw err;
          }

    });
    
}
*/

function User(obj){
	
	for (var key in obj){
	     this[key]=obj[key];
	}

};

var tmpUserObj;

User.prototype.save=function(fn){
	if (this.userid){
		this.update(fn);
	} else {
        console.log(" step: 8;");
        this.hashPassword(this.handleUserSaveAndError);

	}
	
};

User.prototype.update=function(fn){
    var sqlStatement="update users set username=?, userpw=?, userage=?, pwsalt=? where userid=?";
    dbObj.query(sqlStatement, [this.username, this.userpw, this.userage, this.pwsalt, this.userid], function(err){
    	  if (err){
    	  	  throw err;
    	  }
    });
};


User.prototype.handleUserSaveAndError=function(err,userObj){


    if (err){
        throw err;
    }
    
    this.username=userObj.username;
	this.userpw=userObj.userpw;
	this.userage=userObj.userage;
	this.pwsalt=userObj.pwsalt;

    var sqlStatement = "insert into users(username, userpw, userage, pwsalt) values(?, ?, ?, ?)";

    dbObj.query(sqlStatement, [this.username, this.userpw, this.userage, this.pwsalt], function(err,result){

          if (err){
              throw err;
          }
          userObj.userid=result.insertId;
    });
};


User.prototype.hashPassword = function(fn){


	tmpUserObj = this;

	bcrypt.genSalt(12, function(err, salt){

        if (err){
        	return fn(err);
        }

        tmpUserObj.pwsalt = salt;

        bcrypt.hash(tmpUserObj.userpw, tmpUserObj.pwsalt, function(err, hash){
        	if (err){
        		return fn(err);
        	}
        	tmpUserObj.userpw=hash;

        	fn(null,tmpUserObj);
        });
        
	});

};

User.prototype.saveUserInfo=function(req,res,url,fn){

	tmpUserObj = this;

	bcrypt.genSalt(12, function(err, salt){

        if (err){
        	return fn(err);
        }

        tmpUserObj.pwsalt = salt;

        bcrypt.hash(tmpUserObj.userpw, tmpUserObj.pwsalt, function(err, hash){
        	if (err){
        		return fn(err);
        	}
        	tmpUserObj.userpw=hash;

        	var sqlStatement = "insert into users(username, userpw, userage, pwsalt) values(?, ?, ?, ?)";

        	dbObj.query(sqlStatement, [tmpUserObj.username, tmpUserObj.userpw, tmpUserObj.userage, tmpUserObj.pwsalt], function(err,result){

                        if (err){
                            throw err;
                        }
                        tmpUserObj.userid=result.insertId;
                        fn(null,tmpUserObj,req,res,url);
            });
        	
        });
        
	});
	
};


User.prototype.setUserInfo=function(err, userObj,req,res,url){
	 if (err){
	 	 throw err;
	 }
     
     if (userObj){

     	 this.username=userObj.username;
	     this.userpw=userObj.userpw;
	     this.userage=userObj.userage;
	     this.pwsalt=userObj.pwsalt;
	     this.userid=userObj.userid;

	     req.session.uid = userObj.userid;
	     req.session.uname = userObj.username;

         res.redirect(url);
         //res.send("User registeration complete");
     }
};


User.prototype.toJSON = function(){
     return {
                userid: this.userid,
                username: this.username,
                userage: this.userage
            };
};

/*
var tobi = new User({
    username: "Longquan",
    userpw: "This is a rocket",
    userage: 33
});

tobi.save(function(err){
    if (err) {
    	throw err;
    }
});
*/

User.getUserInfoByName = function(username, fn){
	var sqlStatement = "select * from users where username=? limit 1";

    dbObj.query(sqlStatement, [username], function(err,rows){
          if (err){
              return fn(err);
          }
          
          if (rows.length>0){
          	  var userInfo={
          	                  userid: rows[0]["userid"],
          	                  username: rows[0]["username"],
          	                  userpw: rows[0]["userpw"],
          	                  userage: rows[0]["userage"],
          	                  pwsalt: rows[0]["pwsalt"]
                           };

              fn(null, new User(userInfo));
          } else {

          	  fn(null, null);
          }
    });

};

User.getUserInfoById = function(userid, fn){
    var sqlStatement = "select * from users where userid=? limit 1";

    dbObj.query(sqlStatement, [userid], function(err,rows){
          if (err){
              return fn(err);
          }
          
          if (rows.length>0){
          	  var userInfo={
          	                  userid: rows[0]["userid"],
          	                  username: rows[0]["username"],
          	                  userpw: rows[0]["userpw"],
          	                  userage: rows[0]["userage"],
          	                  pwsalt: rows[0]["pwsalt"]
                           };

              fn(null, new User(userInfo));
          } else {

          	  fn(null, null);
          }
    });
};

User.authenticate = function(username, userpw, fn){

     User.getUserInfoByName(username, function(err, userObj){

          if (err){
          	  return fn(err);
          }

          if (!userObj){
          	  return fn();
          }

          bcrypt.hash(userpw, userObj.pwsalt, function(err, hash){
          	   if (err){
          	   	   return fn(err);
          	   }

               if (hash==userObj.userpw){
               	   return fn(null, userObj);
               }
                
               fn();
          });
     });
}; 


User.authenticateForApi=function(req,res,next){
     var authorization=req.headers.authorization;
     if (!authorization){
          return res.send(401);
     }

     var parts=authorization.split(" ");
     var scheme=parts[0];
     var auth=new Buffer(parts[1],'base64').toString().split(':');
     var user=auth[0];
     var pass=auth[1];

     authenticateWithUserInfo(req, res, user, pass, next, completeAuthenticate);
};

function authenticateWithUserInfo(req, res, user, pass, next, fn){
     
     User.getUserInfoByName(user, function(err, userObj){

          if (err){
              return fn(err, next, res);
          }

          if (!userObj){
              var err = new Error("Invalid User Obj");
              return fn(err, next, res);
          }

          bcrypt.hash(pass, userObj.pwsalt, function(err, hash){
               if (err){
                   return fn(err, next, res);
               }

               if (hash==userObj.userpw){
                   req.userObjForApi=userObj;
                   return fn(null, next, res);
               }
               
               fn(null,null,res);
          });
     });
};

function completeAuthenticate(err, next, res){
     if (err){
         return res.send(401);
     }

     if (next==null){
         return res.send("Invalid password.");
     }

     next();
};
