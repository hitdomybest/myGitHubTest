


exports.required = function(field){
	
	return function(req, res, next){
	       var bodyData = req.body;
	       var fieldValue = bodyData[field];

	       if (!fieldValue){
               
               /*
	           var msg = "Error, input data for field '"+field+"' required.";
	           res.error(msg);
	           res.redirect("back");
	           return;
               */
               
               var msg = "Error, input data for field '"+field+"' required.";

               if (req.userObjForApi){
                   return res.json({error:msg});
               } else {
               	   res.error(msg);
	               res.redirect("back");
	               return;
               }

	       }

	       next();
	}

}

exports.lengthAbove = function(field, len){

	 return function(req, res, next){
	 	 var bodyData = req.body;
	 	 var fieldValue = bodyData[field];
	 	 if (fieldValue.length < len){
	 	 	 /*
	 	 	 var msg = "The length of input data for field '"+field+"' should be no less than "+len+".";
	 	 	 res.error(msg);
	 	 	 res.redirect("back");
	 	 	 return;
             */

             var msg = "The length of input data for field '"+field+"' should be no less than "+len+".";
             if (req.userObjForApi){
                 return res.json({error:msg});
             } else {             	 
	 	 	     res.error(msg);
	 	 	     res.redirect("back");
	 	 	     return;
             }
	 	 }
	 	 next();
	 }
}