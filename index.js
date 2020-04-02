const express = require('express');
const app = express();
const server = app.listen(3000);

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ entities: [] }).write()

app.use(express.static('public'));


const socket = require('socket.io');
const io = socket(server);


io.sockets.on('connection', newConnection);

console.clear();
console.log("server is running");

function newConnection(socket){
	socket.on('DBsave', saveEntities);
	socket.on('DBclear', clearEntities);
	socket.on('DBload', loadEntities);
	socket.on('canvasClear', canvasClear);

	function saveEntities(data) {
		db.set('entities', data).write();
		//db.get('entities').push(data).write();
		console.log("saved map");
	}

	function clearEntities(){
		db.set('entities', []).write();
		console.log("map save cleared");
	}

	function loadEntities(){
		let data = db.get('entities').value();
		io.sockets.emit('entitiesLoad', data);
		console.log("map loaded");
	}

	function canvasClear(){
		console.log("canvas cleared");
		//only this because all code is in ./public/index.js
	}
}
