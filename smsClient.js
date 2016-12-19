/**
 * Created by Tracy on 12/18/2016.
 */
"use strict";
var StatusResponse = require('./lib/statusResponse').StatusResponse;
var twilio = require('twilio');

var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

// Find your account sid and auth token in your Twilio account Console.
var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

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

exports.sendMessage = sendMessage;
exports.sendMessages = sendMessages;