
var http=require("http");
var server=http.createServer(function(req, res){
	res.write("<h1 style='color:blue;'>Hello Word</h1>");
	res.end();
});

server.listen(3500,function(){
	console.log("Http Server base on node.js is listening on port 3500 now.");
});