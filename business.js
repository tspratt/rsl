/**
 * Contains business logic functions for shell app
 */
"use strict";
var StatusResponse = require('./lib/statusResponse').StatusResponse;

//var async = require('async');
var model = require('./model');
//var request = require('request');

function isAlive(callback){
	var oData = {};
	var statusResponse = new StatusResponse('success','isAlive','','business',oData);
	callback(null, statusResponse);

}


function listMembers(filterSpec,pageSpec, fieldSpec, callback){
	fieldSpec = fieldSpec || {};																							//send an empty object if parameter not provided
	model.listMembers(filterSpec, pageSpec, fieldSpec, function(err, aMembers){
		if (err) {
			var statusResponse = new StatusResponse('error','listMembers','','business',err);
		}
		else {
			var statusResponse = new StatusResponse('success','listMembers','','business',aMembers);
		}

		callback(err,statusResponse);
	});
}

function filterMembersByName(matchString, oFieldSpec, callback){
	model.filterMembersByName(matchString,oFieldSpec,function(err, aMembers){
		if (err) {
			var statusResponse = new StatusResponse('error','filterMembersByName','','business',err);
		}
		else {
			var statusResponse = new StatusResponse('success','filterMembersByName','','business',aMembers);
		}

		callback(err,statusResponse);
	});
}

function getMember(id, callback){
	model.getMember(id,function(err, aMembers){
		if (err) {
			var statusResponse = new StatusResponse('error','v','','business',err);
		}
		else {
			var statusResponse = new StatusResponse('success','getMember','','business',aMembers);
		}

		callback(err,statusResponse);
	});
}

function insertMembers(callback){
	model.insertMembers(callback);

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
exports.getMember = getMember;
exports.filterMembersByName = filterMembersByName;
exports.listMembers = listMembers;
exports.getHttpResponse = getHttpResponse;



