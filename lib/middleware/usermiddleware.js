

var User = require("../user");

/*
module.exports = function(req, res, next){
	var uid = req.session.uid;
	if (!uid){
	    return next();
	}

    User.getUserInfoById(uid, function(err, userObj){
         if (err){
             return next(err);
         }

         if (userObj){
         	 req.user=res.locals.user=userObj;
         }
         
         next();
    });
}
*/


module.exports = function(req, res, next){

    if (req.userObjForApi){
        req.user=res.locals.user=req.userObjForApi;
        next();
    } else {
        var uid = req.session.uid;
        if (!uid){
            return next();
        }

        User.getUserInfoById(uid, function(err, userObj){
            if (err){
                return next(err);
            }

            if (userObj){
                req.user=res.locals.user=userObj;
            }
         
            next();
        });
    }
}
