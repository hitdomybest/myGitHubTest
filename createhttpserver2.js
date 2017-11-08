var http=require("http");
var server=http.createServer(function(req, res){
	var url="http://google.com";
	var body="<p style='color:red;'>Redirecting to <a href='" + url+"'>"+url+"</a></p>";
	res.setHeader("Location",url);
	res.setHeader("content-length",body.length);
	res.setHeader("content-type","text/html");
	res.statusCode=302;
	res.write(body);
	res.end();
});

server.listen(3500,function(){
	console.log("Http Server base on node.js is listening on port 3500 now.");
});