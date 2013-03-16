var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var question;

server.listen(8080);

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
	
	socket.emit('question', question);
	
	socket.on('generateQuestion', function(generatedQuestion){
		console.log(generatedQuestion);
		question = generatedQuestion;
	});	
	
	socket.on('answer', function (answer){
		console.log(' received message ', answer);
		io.sockets.emit('answerlist', answer);
	});
	
});
