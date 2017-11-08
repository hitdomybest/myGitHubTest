


exports.showDefaultPage=function(req, res){

    res.locals.uid = req.session.uid;
    res.locals.uname = req.session.uname;
	res.render("default",{title:"Index"});
}

