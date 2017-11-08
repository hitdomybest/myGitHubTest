var http=require("http");
var server=http.createServer(function(req, res){
	var body="<h1 style='color:red;'>Hello Word!</h1>";
	res.setHeader("content-length",body.length);
	res.setHeader("content-type","text/html");
	res.write(body);
	res.end();
});

server.listen(3500,function(){
	console.log("Http Server base on node.js is listening on port 3500 now.");
});