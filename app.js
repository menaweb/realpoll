var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var question;

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
	
	socket.emit('question', question);
	
	socket.on('generateQuestion', function(generatedQuestion){
		console.log(generatedQuestion);
		question = generatedQuestion;
	});	
	
	socket.on('answer', function (answer){
		if(question === null){
			return;
		}
		console.log(' received message ', answer);
		io.sockets.emit('answerlist', answer);
	});

	socket.on('timeIsUp', function(){
		question = null;
	});
});
