/**
 * Contains business logic functions for shell app
 */
"use strict";
var StatusResponse = require('./lib/statusResponse').StatusResponse;
var utils = require('./lib/utils');
var model = require('./models/model');

function isAlive(callback){
	var oData = {};
	var statusResponse = new StatusResponse('success','isAlive','','business',oData);
	callback(null, statusResponse);

}

function loginUser(userid, password, callback){
	model.getUser({userid: userid}, function(err, user){
		var statusResponse;
		if (err) {
			statusResponse = new StatusResponse('error','loginUser','','business',err);
		}
		else {
			if (!user) {
				statusResponse = new StatusResponse('fail','loginUser','','business',{message:'user not found'});
			}
			else {
				if (utils.compareHash(password, user.salt, user.passwordHash)) {
					delete user.passwordHash;
					delete user.salt;
					statusResponse = new StatusResponse('success','loginUser','','business',user);
				}
				else {
					statusResponse = new StatusResponse('fail','loginUser','','business',{message: 'incorrect password for ' + userid});
				}
			}
		}
		callback(err,statusResponse);
	});
}

function listPersons(oQuery, filterSpec, pageSpec, fieldSpec, callback){
	var statusResponse;
	model.listPersons(oQuery, filterSpec, pageSpec, fieldSpec, function(err, aPersons){
		if (err) {
			statusResponse = new StatusResponse('error','listPersons','','business',err);
		}
		else {
			statusResponse = new StatusResponse('success','listPersons','','business',aPersons);
		}

		callback(err,statusResponse);
	});
}

function filterPersonsByName(matchString, oFieldSpec, callback){
	var statusResponse;
	model.filterPersonsByName(matchString,oFieldSpec,function(err, aPersons){
		if (err) {
			statusResponse = new StatusResponse('error','filterPersonsByName','','business',err);
		}
		else {
			statusResponse = new StatusResponse('success','filterPersonsByName','','business',aPersons);
		}

		callback(err,statusResponse);
	});
}

function getPerson(id, callback){
	var statusResponse;
	model.getPerson(id,function(err, aPersons){
		if (err) {
			statusResponse = new StatusResponse('error','v','','business',err);
		}
		else {
			statusResponse = new StatusResponse('success','getPerson','','business',aPersons);
		}

		callback(err,statusResponse);
	});
}


function listMembers(filterSpec,pageSpec, fieldSpec, callback){
	var statusResponse;
	fieldSpec = fieldSpec || {};																							//send an empty object if parameter not provided
	model.listMembers(filterSpec, pageSpec, fieldSpec, function(err, aMembers){
		if (err) {
			statusResponse = new StatusResponse('error','listMembers','','business',err);
		}
		else {
			statusResponse = new StatusResponse('success','listMembers','','business',aMembers);
		}

		callback(err,statusResponse);
	});
}

function listRooms(filterSpec,pageSpec, fieldSpec, callback){
	var statusResponse;
	fieldSpec = fieldSpec || {};																							//send an empty object if parameter not provided
	model.listRooms(filterSpec, pageSpec, fieldSpec, function(err, aPersons){
		if (err) {
			statusResponse = new StatusResponse('error','listRooms','','business',err);
		}
		else {
			statusResponse = new StatusResponse('success','listRooms','','business',aPersons);
		}

		callback(err,statusResponse);
	});
}

function bookRoom(sAction, oBooking, callback){
	var statusResponse;
	if (sAction === 'insert') {
		model.insertBooking(oBooking,function(err, result){
			if (err) {
				statusResponse = new StatusResponse('error','bookRoom','','business',err);
			}
			else {
				statusResponse = new StatusResponse('success','bookRoom','','business',result);
			}
			callback(err,statusResponse);
		});
	}
	else if (sAction === 'update') {
		statusResponse = new StatusResponse('error','bookRoom','','business','not implemented');
		callback(err,statusResponse);
	}

}

function insertPerson(oPerson, callback){
	var statusResponse;
	model.insertPerson(oPerson, function (err, result) {
		if (err) {
			statusResponse = new StatusResponse('error','insertPerson','','business',err);
		}
		else {
			statusResponse = new StatusResponse('success','insertPerson','','business',result);
		}
		callback(err,statusResponse);
	});

}

function insertCollection(sCollection, callback) {
	model.insertCollection(sCollection, callback)
}

exports.isAlive = isAlive;
exports.loginUser = loginUser;
exports.getPerson = getPerson;
exports.filterPersonsByName = filterPersonsByName;
exports.listPersons = listPersons;
exports.listMembers = listMembers;
exports.listRooms = listRooms;
exports.bookRoom = bookRoom;
exports.insertPerson = insertPerson;
//exports.insertCollection = insertCollection;
