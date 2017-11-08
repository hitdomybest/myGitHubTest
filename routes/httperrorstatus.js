

exports.notfound = function(req, res){
    res.status(404);
    res.format({
        "text/html": function(){
            res.render("404Error");
        }, 
        "application/json": function(){
            res.send({message: "Resource not found."});
        },
        "application/xml": function(){
            res.write("<error>\n");
            res.write("  <message>Resource not found</message>\n");
            res.end("</error>\n");
        },
        "text/plain": function(){
            res.send("Resource not found\n");
        }
    });	
};


exports.fivehundrederror = function(err, req, res, next){
     console.error(err.stack);
     var msg;

     switch (err.type){
     	 case "database": 
     	     msg = "Server Unavailable.";
             res.statusCode = 503;
             break;
         default:
             msg = "Internal server error.";
             res.statusCode = 500;
             break;         
     }
     
     res.format({
         
         "text/html": function(){
         	 res.render("5xxError",{msg:msg, status:res.statusCode});
         },

         "application/json": function(){
         	 res.send({error:msg});
         },

         "text/plain": function(){
         	 res.send(msg + "\n");
         }

     });
}; 