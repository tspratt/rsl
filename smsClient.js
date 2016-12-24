/**
 * Created by Tracy on 12/18/2016.
 */
"use strict";
var model = require('./models/model');
var StatusResponse = require('./lib/statusResponse').StatusResponse;
var twilio = require('twilio');

var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

// Find your account sid and auth token in your Twilio account Console.
var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

function sendActionMessages (sAction, userid, callback) {
	var statusResponse;
	var responses = [];
	var isError = false;
	var sMessage = userid + ' performed action: ' + sAction;;
	model.listSMSNumbers(sAction, function (err, aData) {
		if (!err) {
			var toNumberList = aData.map(function(element){
				return element.phone;
			});
			toNumberList.forEach(function (element) {
				sendMessage (element, sMessage, function (err, statusResponse) {
					if (!statusResponse.success) {isError = true;}
					responses.push(statusResponse);
					if (responses.length === toNumberList.length) {
						statusResponse = new StatusResponse((isError)?'error':'success', 'sendMessage', '', 'smsClient', {responses: responses});
						callback(null, statusResponse);
					}
				}) ;
			})
		}
		else {
			callback(err);
		}
	});
}

function sendMessages (toNumberList, sMessage, callback) {
	var statusResponse;
	var responses = [];
	var isError = false;
	toNumberList.forEach(function (element) {
		sendMessage (element, sMessage, function (err, statusResponse) {
			if (!statusResponse.success) {isError = true;}
			responses.push(statusResponse);
			if (responses.length === toNumberList.length) {
				statusResponse = new StatusResponse((isError)?'error':'success', 'sendMessage', '', 'smsClient', {responses: responses});
				callback(null, statusResponse);
			}
		}) ;
	})
}

function sendMessage (toNumber, sMessage, callback) {
	var statusResponse;
		client.sendMessage({
			to: toNumber,
			from: '6785621174',
			body: sMessage
		}, function(err, data) {
					if (!err) {
						statusResponse = new StatusResponse('success', 'sendMessage', '', 'smsClient', {toNumber:toNumber, message: sMessage});
					}
					else {
						statusResponse = new StatusResponse('error', 'sendMessage', '', 'business', err);
					}
					if (typeof callback === 'function') {
						callback(null, statusResponse);
					}
				}
	)
}
/*
function buildActionMessage (sAction, userid,) {
	var sReturn = '';
	switch (sAction) {
		case 'login_app':
			sReturn = userid + ' performed action: ' + sAction;
			break;
		case 'send_chat':

			break;
		case 'add_booking':

			break;
		case 'edit_booking':

			break;
		case 'delete_booking':

			break;
	}
	return sReturn;
}
*/
exports.sendMessage = sendMessage;
exports.sendMessages = sendMessages;
exports.sendActionMessages = sendActionMessages;