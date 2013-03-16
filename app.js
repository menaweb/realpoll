var app = require('express')()
  , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function (req, res) {
	  res.sendfile(__dirname + '/index.html');
});

app.get('/device', function (req, res) {
	  res.sendfile(__dirname + '/dashboard.html');
});


io.sockets.on('connection', function (socket) {

	socket.emit('answer', { hello: 'world' });
	socket.on('message', function (from){
		console.log(' received message ', from);
		io.sockets.emit('answer', from);
	});
	
});
