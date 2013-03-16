var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

if (process.env.REDISTOGO_URL) {
	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	var redisclient = require("redis").createClient(rtg.port, rtg.hostname);
	redisclient.auth(rtg.auth.split(":")[1]); 

} else {
 	var redisclient = require("redis").createClient();
}

var port = process.env.PORT || 8080; 

server.listen(port);

app.use("/img", express.static(__dirname + '/img'));

app.get('/', function (req, res) {
	  res.sendfile(__dirname + '/index.html');
});

app.get('/dashboard', function (req, res) {
	  res.sendfile(__dirname + '/dashboard.html');
});

app.get('/test', function (req, res) {
	  res.sendfile(__dirname + '/test.html');
});

app.post('/result', function(req, res){
	  res.sendfile(__dirname + '/results.html');
});

io.sockets.on('connection', function (socket) {
	
		redisclient.get("question", function(error, response) {
		if(response) {
			console.log(response);
			var res = JSON.parse(response);
			socket.emit('question', res);
		 }
		else {
			socket.emit('question', null);
		}});
	
	socket.on('generateQuestion', function(generatedQuestion){
		var res = JSON.stringify(generatedQuestion)
		redisclient.set("question", res);		
		console.log(generatedQuestion);
	});	
	
	socket.on('answer', function (answer){
		redisclient.get("question", function(error, response) {
		if(response) {
			console.log(' received message ', answer);
			io.sockets.emit('answerlist', answer);
		 }});
	});

	socket.on('timeIsUp', function(){
		redisclient.del("question");
	});
});
