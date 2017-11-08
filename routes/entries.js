

var Entry = require("../lib/entry");

var db=require("../models/dbObj");


exports.entriesReturned=[];

/*
exports.showEntriesList=function(req, res, next){
	Entry.getEntriesByRange(0, -1, function(err,entries){
          if (err){
          	  return next(err);
          }
          exports.entriesReturned=entries;
          res.render("entries",{title: "Entries", entries: entries});
	});
};
*/

exports.showEntriesList=function(req, res, next){
	
	var pagerObj = req.pagerObj;

	Entry.getEntriesByRange(pagerObj.startIndex, pagerObj.perpage, function(err,entries){
          if (err){
          	  return next(err);
          }
          exports.entriesReturned=entries;
          res.render("entries",{title: "Entries", entries: entries});
	});
};


exports.initialTable = function(req, res, next){
	var sqlStatement = "CREATE TABLE IF NOT EXISTS entries (" 
                     + "id INT(10) NOT NULL AUTO_INCREMENT, " 
                     + "username varchar(50) DEFAULT '', " 
                     + "entry varchar(500) DEFAULT '', " 
                     + "PRIMARY KEY(id))";
    
    db.query(sqlStatement,function(err){
            if (err){
                throw err;
            }
            next();
    });
};


exports.showPostForm = function(req, res){
    if (!req.user){
        res.send("Please login first.");
    } else {
        res.render("postentry",{title: "Post Entry"});
    }
};


exports.doUserPost = function(req, res, next){

    var username = res.locals.user.username;
    var bodyData = req.body;
    var entryTitle = bodyData.entry_title;
    var entryBody = bodyData.entry_body;

    /*
    if (!entryTitle){
    	res.error("Title is required.");
    	res.redirect("back");
    	return;
    }
    
    if (entryTitle.length<4){
        res.error("Title must be longer than 4 characters");
        res.redirect("back");
    	return;
    }
    */

    var entry = new Entry({
        "title": entryTitle,
        "body": entryBody 
    });
    
    /*
    entry.saveEntryInfo(username, function(err){
    	if (err){
    		return next(err);
    	}

    	res.redirect("/post/showEntriesList");
    });
    */
    
    entry.saveEntryInfo(username, function(err){
        if (err){
            return next(err);
        }
        
        if (req.userObjForApi){
            var msgJson={message: "Entry added."};
            res.json(msgJson);
        } else {
            res.redirect("/post/showEntriesList"); 
        }
    });

};