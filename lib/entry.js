

var db=require("../models/dbObj");

module.exports=Entry;

function Entry(obj){
	for (var key in obj){
	     this[key] = obj[key];
	}
};

Entry.prototype.saveEntryInfo = function(username, fn){
	var entryJSON = JSON.stringify(this);
    
    var sqlStatement = "insert into entries(username, entry) values(?,?)";
    
    db.query(sqlStatement, [username, entryJSON], function(err){
            if (err){
                return fn(err);
            }
            fn(null);
    });
};

Entry.getEntriesByRange = function(startIndex, length, fn){
	
	var sqlStatement = "";
    var params = [];
	if ((startIndex==0) && (length==-1)){
       sqlStatement = "select * from entries order by id desc";
	} else {
	   sqlStatement = "select * from entries order by id desc limit ?,?";
	   params = [startIndex,length];	
	}
    
    /*
	db.query(sqlStatement, [startIndex,length], function(err, rows){
            if (err){
            	return fn(err);
            }
            fn(null,rows);
	});
	*/
    
    db.query(sqlStatement, params, function(err, rows){
            if (err){
            	return fn(err);
            }

            var entries = [];

            rows.forEach(function(item){
                 var entryJSON=item["entry"];
                 var entryData = JSON.parse(entryJSON);
                 var username=item["username"];
                 entryData["username"]=username;
                 entries.push(entryData);
            });

            fn(null,entries);
	});
};



Entry.initialTable = function(req, res, next){
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


Entry.getEntriesCount = function(fn){

	var sqlStatement = "select count(*) as total_count from entries";
    
    db.query(sqlStatement, function(err, rows){
            if (err){
            	return fn(err);
            }

            var totalCount = rows[0]["total_count"];
            totalCount=parseInt(totalCount); 
            fn(null,totalCount);
	});
}