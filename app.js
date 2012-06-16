var http = require('http'), io = require('socket.io'), sys = require("sys"), fs = require('fs'), util = require('util');

var Box2D = require('./box2d.js');

eval(fs.readFileSync('common.js') + '');

var clients = [];

function update() {
	world.Step(1 / 60, 10, 10);
	world.ClearForces();
}
setInterval(update, 1000 / 60);

function jointsToClients(data) {
	for (var i = 0; i < clients.length; i++) {
		clients[i].send(JSON.stringify(data));
	}
}

setupWorld();

// SOCKETS

var server = http.createServer(
	function(req, res){
		res.writeHead(200, {'Content-Type': 'text/html'}); 
		res.end('<h1>Hello world</h1>'); 
	}
);
server.listen(xport, xhost);
console.log(xport);
var socket = io.listen(server);

socket.on('connection', function(client) {
	clients.push(client);
	console.log("Total clients: " + clients.length);
	
	client.send(JSON.stringify({"startId" : clients.length}));

	client.on('message', function(data){
		data = JSON.parse(data);
		if (data.hasOwnProperty("destroyId")) {
			deleteJoint(data.destroyId);
			console.log('destroyed');		
		} else {
			updateJoints(data);	
		}

		jointsToClients(data);
	});

	client.on('disconnect', function(){
		console.log("disconnect");		
	}); 
});
