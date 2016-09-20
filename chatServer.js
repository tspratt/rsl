/**
 * Created by Tracy on 9/19/2016.
 */
"use strict";


var app = require('./app');
var server = app.createServer();
var io = require('socket.io').listen(server);
var logger = require('winston');
var model = require('./models/model');
var appConstants = require('./lib/appConstants');


var handleDisconnect = function () {
	logger.info('RSL socket disconnect...');
};

var handleMessage = function (from, msg) {
	logger.info('Chat message from: ', from,':', msg);
};

var handleConnect = function (socket) {
	logger.info('RSL socket connection...');
	socket.on('disconnect', handleDisconnect);
	socket.on('message', handleMessage)
};


io.on('connection', handleConnect);

