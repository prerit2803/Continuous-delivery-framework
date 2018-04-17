var http = require('http');
var request = require('request');
var os = require('os');

var exec = require('child_process').exec;

// websocket server that website connects to.
var io = require('socket.io')(3000);

/// CHILDREN nodes
var nodeServers =
{
	"Server-1": {url:"http://<SERVER-1>:8080/iTrust2/login", latency: 0},
	"Server-2": {url:"http://<SERVER-2>:8080/iTrust2/login", latency: 0},
	"Server-3": {url:"http://<SERVER-3>:8080/iTrust2/login", latency: 0},
	"Server-4": {url:"http://<SERVER-4>:8080/iTrust2/login", latency: 0},
	"Server-5": {url:"http://<SERVER-5>:8080/iTrust2/login", latency: 0}
};

// Launch servers.
// exec("node fastService.js");
// exec("node mediumService.js");
// exec("node slowService.js");

function memoryLoad()
{
	// console.log("Memory", os.totalmem(), os.freemem() );
	return (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2);
}

// Create function to get CPU information
function cpuTicksAcrossCores()
{
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++)
  {
		//Select CPU core
		var cpu = cpus[i];
		//Total up the time in the cores tick
		for(type in cpu.times)
		{
			totalTick += cpu.times[type];
		}
		//Total up the idle time of the core
		totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

var startMeasure = cpuTicksAcrossCores();

function cpuAverage()
{
	var endMeasure = cpuTicksAcrossCores();

	//Calculate the difference in idle and total time between the measures
	var idleDifference = endMeasure.idle - startMeasure.idle;
	var totalDifference = endMeasure.total - startMeasure.total;

	//Calculate the average percentage CPU usage
	return (((totalDifference - idleDifference) / totalDifference) * 100).toFixed(2);
}

function measureLatenancy(server)
{
	// var color = "#ff0000";
	var options =
	{
		url: server.url
	};
	console.log("request to url", server.url);
	var before = Date.now();
	request(options, function (error, res, body)
	{
		// console.log( error, res.statusCode, server.url);
		if(error || res.statusCode != 200){
			console.log("ERROR", server.url);
			server.latency = 0;
			// return {color: "#ff0000"};
		}else{
			console.log("RECEIVED", res.statusCode, server.url);
			var after = Date.now();
			server.latency = (after - before) /  2;
		}
	});
	console.log("latency",  server.latency);
	if( server.latency > 0 )
		return {color: "#00ff00"};
	else
		return {color: "#ff0000"};
}

// function calculateColor(server)
// {
// 	// latency scores of all nodes, mapped to colors.
// 	console.log("Check for ", server)
// 	return measureLatenancy(server, function(latency)
// 	{
// 		var color = "#ff0000";
// 		if( !latency )
// 			return {color: color};
// 		if( latency > 10 )
// 		{
// 			color = "#00ff00";
// 		}
// 		console.log("latency", latency );
// 		return {color: color};
// 	});
// 	//console.log( nodes );
// 	// return nodes;
// }


io.on('connection', function (socket) {
	console.log("Received connection");

	///////////////
	//// Broadcast heartbeat over websockets
	//////////////
	var heartbeatTimer1 = setInterval( function ()
	{
		var data = {
			name: "Server-1", cpu: cpuAverage(), memoryLoad: memoryLoad()
			,nodes: [measureLatenancy(nodeServers["Server-1"])]
		};
		console.log("interval", data)
		//io.sockets.emit('heartbeat', data );
		socket.emit("heartbeat", data);
	}, 5000);
	var heartbeatTimer2 = setInterval( function ()
	{
		var data = {
			name: "Server-2", cpu: cpuAverage(), memoryLoad: memoryLoad()
			,nodes: [measureLatenancy(nodeServers["Server-2"])]
		};
		console.log("interval", data)
		//io.sockets.emit('heartbeat', data );
		socket.emit("heartbeat", data);
	}, 5000);
	var heartbeatTimer3 = setInterval( function ()
	{
		var data = {
			name: "Server-3", cpu: cpuAverage(), memoryLoad: memoryLoad()
			,nodes: [measureLatenancy(nodeServers["Server-3"])]
		};
		console.log("interval", data)
		//io.sockets.emit('heartbeat', data );
		socket.emit("heartbeat", data);
	}, 5000);
	var heartbeatTimer4 = setInterval( function ()
	{
		var data = {
			name: "Server-4", cpu: cpuAverage(), memoryLoad: memoryLoad()
			,nodes: [measureLatenancy(nodeServers["Server-4"])]
		};
		console.log("interval", data)
		//io.sockets.emit('heartbeat', data );
		socket.emit("heartbeat", data);
	}, 5000);
	var heartbeatTimer5 = setInterval( function ()
	{
		var data = {
			name: "Server-5", cpu: cpuAverage(), memoryLoad: memoryLoad()
			,nodes: [measureLatenancy(nodeServers["Server-5"])]
		};
		console.log("interval", data)
		//io.sockets.emit('heartbeat', data );
		socket.emit("heartbeat", data);
	}, 5000);

	socket.on('disconnect', function () {
		console.log("closing connection")
    	clearInterval(heartbeatTimer1);
			clearInterval(heartbeatTimer2);
			clearInterval(heartbeatTimer3);
			clearInterval(heartbeatTimer4);
			clearInterval(heartbeatTimer5);
  	});
});
