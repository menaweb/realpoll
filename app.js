var app = require('express')()
  , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

var question;

server.listen(8080);

app.get('/', function (req, res) {
	  res.sendfile(__dirname + '/index.html');
});

app.get('/dashboard', function (req, res) {
	  res.sendfile(__dirname + '/dashboard.html');
});

app.get('/test', function (req, res) {
	  res.sendfile(__dirname + '/test.html');
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

var generateQuestion = function()
{
	return {question: "Who is Miquel Camps", answers: ["A fisherman", "A politician", "A startup person"], correctAnswer:2};
}
