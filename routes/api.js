
var Entry = require("../lib/entry");

//var express = require("express");
var expressBasicAuth = require("express-basic-auth");
var User = require("../lib/user");

exports.auth = User.authenticateForApi;

exports.getUserDataById = function(req, res, next){
	var userId = req.params.userid; 
	User.getUserInfoById(userId, function(err,userObj){
         if (err){
         	 return next(err);
         }

         if (!userObj.userid){
         	 return res.send(404);
         }
         
         res.json(userObj);
	});

};

exports.getEntriesList = function(req, res, next){
	var pagerObj = req.pagerObj;

	Entry.getEntriesByRange(pagerObj.startIndex, pagerObj.perpage, function(err,entries){
          if (err){
          	  return next(err);
          }

          //res.json(entries);
          
          res.format({
              "application/json": function(){
                  res.send(entries);
              },
              "application/xml": function(){
                  res.render("entries/xml_entries",{entries:entries});
              }  
          });

	});
}
