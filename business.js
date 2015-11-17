/**
 * Contains business logic functions for shell app
 */
"use strict";
var StatusResponse = require('./lib/statusResponse').StatusResponse;
var utils = require('./lib/utils');
//var async = require('async');
var model = require('./models/model');
//var request = require('request');

function isAlive(callback){
	var oData = {};
	var statusResponse = new StatusResponse('success','isAlive','','business',oData);
	callback(null, statusResponse);

}

function loginUser(userid, password, callback){

	model.getUser({userid: userid}, function(err, user){
		if (err) {
			var statusResponse = new StatusResponse('error','loginUser','','business',err);
		}
		else {
			if (!user) {
				var statusResponse = new StatusResponse('fail','loginUser','','business',{message:'user not found'});
			}
			else {
				if (utils.compareHash(password, user.salt, user.passwordHash)) {
					var statusResponse = new StatusResponse('success','loginUser','','business',user);
				}
				else {
					var statusResponse = new StatusResponse('fail','loginUser','','business',{message: 'incorrect password ' + userid});
				}
			}
		}
		callback(err,statusResponse);
	});
}

function listPersons(filterSpec,pageSpec, fieldSpec, callback){
	fieldSpec = fieldSpec || {};																							//send an empty object if parameter not provided
	model.listPersons(filterSpec, pageSpec, fieldSpec, function(err, aPersons){
		if (err) {
			var statusResponse = new StatusResponse('error','listPersons','','business',err);
		}
		else {
			var statusResponse = new StatusResponse('success','listPersons','','business',aPersons);
		}

		callback(err,statusResponse);
	});
}

function filterPersonsByName(matchString, oFieldSpec, callback){
	model.filterPersonsByName(matchString,oFieldSpec,function(err, aPersons){
		if (err) {
			var statusResponse = new StatusResponse('error','filterPersonsByName','','business',err);
		}
		else {
			var statusResponse = new StatusResponse('success','filterPersonsByName','','business',aPersons);
		}

		callback(err,statusResponse);
	});
}

function getPerson(id, callback){
	model.getPerson(id,function(err, aPersons){
		if (err) {
			var statusResponse = new StatusResponse('error','v','','business',err);
		}
		else {
			var statusResponse = new StatusResponse('success','getPerson','','business',aPersons);
		}

		callback(err,statusResponse);
	});
}

function insertPersons(callback){
	model.insertPersons(callback);

}

function insertCollection(sCollection, callback) {
	model.insertCollection(sCollection, callback)
}

function getHttpResponse(callback) {
	request('http://www.google.com', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body); // Show the HTML for the Google homepage.
			callback(response);
		}
	})

}


exports.isAlive = isAlive;
exports.loginUser = loginUser;
exports.getPerson = getPerson;
exports.filterPersonsByName = filterPersonsByName;
exports.listPersons = listPersons;
exports.getHttpResponse = getHttpResponse;
//exports.insertCollection = insertCollection;
