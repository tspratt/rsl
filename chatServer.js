/**
 * Created by Tracy on 9/19/2016.
 */
"use strict";

var io;
var logger = require('winston');
var model = require('./models/model');
var appConstants = require('./lib/appConstants');

var clients = {};

var handleDisconnect = function (socket) {
	logger.info('RSL socket disconnect...');
	delete clients[socket.id];
	logger.info('Active Clients: ', Object.keys(clients).length);
};

var handleMessage = function (socket, oData) {
	switch (oData.msgType) {
		case 'info':
			logger.info('msgType: ', oData.msgType, ', user:', oData.user.member.llcname);

			break;
		case 'chat':
			logger.info('msgType: ', oData.msgType, 'cmd:', oData.message);
			model.insertChatMessage(oData, function (err, result) {
				if (err) {
					console.log(err);
				}
				else {
					socket.broadcast.emit('chat-msg', {message: oData.message, socketid: socket.id});
				}
			});
			break;
	}
};

var handleCommand = function (socket, oData) {
	var dateSpec = null;
	var aMessages = [];
	switch (oData.cmdType) {
		case 'get':
			logger.info('cmdType: ', oData.cmdType, 'cmd:', oData.cmd);
				switch (oData.cmd) {
					case 'message-list':
						if (oData.dtFrom) {
							dateSpec.from = oData.from;
						}
						model.listChatMessages(dateSpec, function (err, data) {
							if (err) {
								console.log(err);
							}
							else {
								aMessages = data;
							}
							socket.emit('cmd-result', {cmdType:oData.cmdType, cmd: oData.cmd, result:aMessages});
						});
						break;
				}
			break;
	}
};

var handleConnect = function (socket) {
	logger.info('...RSL socket connected...');
	socket.on('disconnect', function() {
		handleDisconnect(socket);
	});
	socket.on('message', function(oMessage) {
		handleMessage(socket, oMessage);
	});
	socket.on('command', function(oCommand) {
		handleCommand(socket, oCommand);
	});
	clients[socket.id] = {socket: socket};
	logger.info('Active Clients: ', Object.keys(clients).length);
	socket.emit('message', {socketId:socket.id, msgType: 'connected'});
};

function initModule (socketIo){
	logger.info('..init chatServer');
	io = socketIo;
	io.on('connection', handleConnect);
}

exports.initModule = initModule;



