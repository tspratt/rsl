/**
 * Contains business logic functions for shell app
 */
"use strict";
var StatusResponse = require('./lib/statusResponse').StatusResponse;
var utils = require('./lib/utils');
var model = require('./models/model');
var smsClient = require('./smsClient');
var appConstants = require('./lib/appConstants');
require('datejs');														//extends the native Date object
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

function isAlive(callback) {
	var oData = {};
	var statusResponse = new StatusResponse('success', 'isAlive', '', 'business', oData);
	callback(null, statusResponse);

}

function authenticate(req, res, next) {
	var statusResponse;
	var sToken = req.headers.authorization;
	jwt.verify(sToken, 'gabboob', function (err, decoded) {
		if (err) {
			statusResponse = new StatusResponse('error', 'authenticate', '', 'business', err);
			res.send(401, statusResponse);
		}
		else {
			next();
		}
	});
}

function loginUser(userid, password, callback) {
	model.getUser({"$text": {"$search": userid}}, function (err, user) {
		var statusResponse;
		if (err) {
			statusResponse = new StatusResponse('error', 'loginUser', '', 'business', err);
		}
		else {
			if (!user) {
				statusResponse = new StatusResponse('fail', 'loginUser', '', 'business', {message: 'user not found'});
			}
			else {
				if (utils.compareHash(password, user.salt, user.passwordHash)) {
					delete user.passwordHash;                                           //remove these from the response
					delete user.salt;
					var token = jwt.sign({userid: userid}, 'gabboob', {expiresIn: '1d'});
					user.token = token;
					statusResponse = new StatusResponse('success', 'loginUser', '', 'business', user);
					if (user.person.phone !== '770-633-1912') {
						smsClient.sendMessage('770-633-1912', '\ndmin Notification:\nUser Login:' + userid, function (err, statusResponse) {
							if (statusResponse.status !== 'success') {
								console.log(statusResponse.message);
							}
						});
					}
				}
				else {
					statusResponse = new StatusResponse('fail', 'loginUser', '', 'business', {message: 'incorrect password for ' + userid});
				}
			}
		}
		callback(err, statusResponse);
	});
}

function setPassword(userid, oldPassword, newPassword, callback) {
	model.getUser({userid: userid}, function (err, user) {
		var statusResponse;
		if (err) {
			statusResponse = new StatusResponse('error', 'setPassword', '', 'business', err);
			callback(err, statusResponse);
		}
		else {
			if (!user) {
				statusResponse = new StatusResponse('fail', 'setPassword', '', 'business', {message: 'user not found'});
				callback(err, statusResponse);
			}
			else {
				if (utils.compareHash(oldPassword, user.salt, user.passwordHash)) {
					var newHash = utils.buildHash(newPassword, user.salt);
					var oUpdate = {$set: {"passwordHash": newHash}};
					var sId = user._id.toString();
					model.updateUser(sId, oUpdate, function (err, result) {
						if (err) {
							statusResponse = new StatusResponse('error', 'setPassword', '', 'business', err);
						}
						else {
							statusResponse = new StatusResponse('success', 'setPassword', '', 'business', result);
						}
						callback(err, statusResponse);
					});
				}
				else {
					statusResponse = new StatusResponse('fail', 'setPassword', '', 'business', {message: 'incorrect original password for ' + userid});
					callback(err, statusResponse);
				}
			}
		}
	});
}

function resetPassword(userid, callback) {
	var tempPassword = 'gabboob';
	model.getUser({userid: userid}, function (err, user) {
		var statusResponse;
		if (err) {
			statusResponse = new StatusResponse('error', 'setPassword', '', 'business', err);
			callback(err, statusResponse);
		}
		else {
			if (!user) {
				statusResponse = new StatusResponse('fail', 'setPassword', '', 'business', {message: 'user not found'});
				callback(err, statusResponse);
			}
			else {
				var newHash = utils.buildHash(tempPassword, user.salt);
				var oUpdate = {$set: {"passwordHash": newHash}};
				var sId = user._id.toString();
				model.updateUser(sId, oUpdate, function (err, result) {
					if (err) {
						statusResponse = new StatusResponse('error', 'setPassword', '', 'business', err);
					}
					else {
						statusResponse = new StatusResponse('success', 'setPassword', '', 'business', result);
					}
					callback(err, statusResponse);
				});
			}
		}
	});
}

function updateUser(sId, oUpdate, callback) {
	var statusResponse;
	model.updateUser(sId, oUpdate, function (err, result) {
		if (err) {
			statusResponse = new StatusResponse('error', 'updateUser', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'updateUser', '', 'business', result);
		}
		callback(err, statusResponse);
	});
}

function listPersons(oQuery, filterSpec, pageSpec, fieldSpec, callback) {
	var statusResponse;
	model.listPersons(oQuery, filterSpec, pageSpec, fieldSpec, function (err, aPersons) {
		if (err) {
			statusResponse = new StatusResponse('error', 'listPersons', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'listPersons', '', 'business', aPersons);
		}

		callback(err, statusResponse);
	});
}

function filterPersonsByName(matchString, oFieldSpec, callback) {
	var statusResponse;
	model.filterPersonsByName(matchString, oFieldSpec, function (err, aPersons) {
		if (err) {
			statusResponse = new StatusResponse('error', 'filterPersonsByName', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'filterPersonsByName', '', 'business', aPersons);
		}

		callback(err, statusResponse);
	});
}

function getPerson(id, callback) {
	var statusResponse;
	model.getPerson(id, function (err, aPersons) {
		if (err) {
			statusResponse = new StatusResponse('error', 'v', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'getPerson', '', 'business', aPersons);
		}

		callback(err, statusResponse);
	});
}

function listMembers(filterSpec, pageSpec, fieldSpec, callback) {
	var statusResponse;
	fieldSpec = fieldSpec || {};																							//send an empty object if parameter not provided
	model.listMembers(filterSpec, pageSpec, fieldSpec, function (err, aMembers) {
		if (err) {
			statusResponse = new StatusResponse('error', 'listMembers', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'listMembers', '', 'business', aMembers);
		}

		callback(err, statusResponse);
	});
}

function listRooms(filterSpec, pageSpec, fieldSpec, callback) {
	var statusResponse;
	fieldSpec = fieldSpec || {};																							//send an empty object if parameter not provided
	model.listRooms(filterSpec, pageSpec, fieldSpec, function (err, aPersons) {
		if (err) {
			statusResponse = new StatusResponse('error', 'listRooms', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'listRooms', '', 'business', aPersons);
		}

		callback(err, statusResponse);
	});
}

function bookRoom(sAction, oBooking, callback) {
	var statusResponse;
	if (sAction === 'insert') {
		model.insertBooking(oBooking, function (err, result) {
			if (err) {
				statusResponse = new StatusResponse('error', 'bookRoom', '', 'business', err);
			}
			else {
				statusResponse = new StatusResponse('success', 'bookRoom', '', 'business', result);
				//model.deleteBooking(result._doc._id);
				//updateResidenceSchedule(result._doc);
			}
			rebuildResidenceSchedule(null, {from: new Date().add(-7).days()}, null, function (err, result) {
				callback(err, statusResponse);
			});

		});
	}
	else if (sAction === 'update') {
		var bookingId = oBooking._id;
		model.updateBooking(bookingId, oBooking, function (err, result) {
			if (err) {
				statusResponse = new StatusResponse('error', 'bookRoom', '', 'business', err);
			}
			else {
				statusResponse = new StatusResponse('success', 'bookRoom', '', 'business', result);
			}

			rebuildResidenceSchedule(null, {from: new Date().add(-7).days()}, null, function (err, result) {
				callback(err, statusResponse);
			});
		});

	}

}


function updateBooking(sId, oUpdate, callback) {
	var statusResponse;
	model.updateBooking(sId, oUpdate, function (err, result) {
		if (err) {
			statusResponse = new StatusResponse('error', 'updateBooking', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'updateBooking', '', 'business', result);
		}
		callback(err, statusResponse);
	});

}

function deleteBooking(sId, callback) {
	var statusResponse;
	model.deleteBooking(sId, function (err, result) {
		if (err) {
			statusResponse = new StatusResponse('error', 'deleteBooking', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'deleteBooking', '', 'business', result);
		}
		rebuildResidenceSchedule(null, {from: new Date().add(-7).days()}, null, function (err, result) {
			callback(err, statusResponse);
		});
	});
}

function insertPerson(oPerson, callback) {
	var statusResponse;
	model.insertPerson(oPerson, function (err, result) {
		if (err) {
			statusResponse = new StatusResponse('error', 'insertPerson', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'insertPerson', '', 'business', result);
		}
		callback(err, statusResponse);
	});

}

function updatePerson(sId, oUpdate, callback) {
	var statusResponse;
	model.updatePerson(sId, oUpdate, function (err, result) {
		if (err) {
			statusResponse = new StatusResponse('error', 'updatePerson', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'updatePerson', '', 'business', result);
		}
		callback(err, statusResponse);
	});
}

function updatePersons(oQuery, oUpdate, callback) {
	var statusResponse;
	model.updatePersons(oQuery, oUpdate, function (err, result) {
		if (err) {
			statusResponse = new StatusResponse('error', 'updatePerson', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'updatePerson', '', 'business', result);
		}
		callback(err, statusResponse);
	});
}

function deletePerson(sId, callback) {
	var statusResponse;
	model.deletePerson(sId, function (err, result) {
		if (err) {
			statusResponse = new StatusResponse('error', 'deletePerson', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'deletePerson', '', 'business', result);
		}
		callback(err, statusResponse);
	});
}

function listRoles(callback) {
	var statusResponse;
	model.listRoles(function (err, aRoles) {
		if (err) {
			statusResponse = new StatusResponse('error', 'listRoles', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'listRoles', '', 'business', aRoles);
		}

		callback(err, statusResponse);
	});
}


function listPermissions(orderBy, callback) {
	var statusResponse;
	var oSort = {};
	if (orderBy && orderBy === 'action') {
		oSort = {"action": 1, "context": 1};
	}
	else {
		oSort = {"context": 1, "action": 1};
	}
	model.listPermissions(oSort, function (err, aPermissions) {
		if (err) {
			statusResponse = new StatusResponse('error', 'listPermissions', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'listPermissions', '', 'business', aPermissions);
		}

		callback(err, statusResponse);
	});
}

function updateMember(sId, oUpdate, callback) {
	var statusResponse;
	model.updateMember(sId, oUpdate, function (err, result) {
		if (err) {
			statusResponse = new StatusResponse('error', 'updateMember', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'updateMember', '', 'business', result);
		}
		callback(err, statusResponse);
	});

}

function checkBookingOverlap(roomId, dtArrive, dtDepart, callback) {
	var statusResponse;
	model.checkBookingOverlap(roomId, dtArrive, dtDepart, function (err, data) {
		if (err) {
			statusResponse = new StatusResponse('error', 'checkBookingOverlap', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'checkBookingOverlap', '', 'business', data);
		}
		callback(err, statusResponse);
	});

}

function listBookings(filterSpec, dateSpec, sortSpec, fieldSpec, callback) {
	var statusResponse;
	fieldSpec = fieldSpec || {};																							//send an empty object if parameter not provided
	model.listBookings(filterSpec, dateSpec, sortSpec, fieldSpec, function (err, aBookings) {
		if (err) {
			statusResponse = new StatusResponse('error', 'listBookings', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'listBookings', '', 'business', aBookings);
		}

		callback(err, statusResponse);
	});
}

function listLinks(callback) {
	var statusResponse;
	model.listLinks(function (err, aLinks) {
		if (err) {
			statusResponse = new StatusResponse('error', 'listLinks', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'listLinks', '', 'business', aLinks);
		}
		callback(err, statusResponse);
	});
}

function insertLink(sLabel, sUrl, callback) {
	var statusResponse;
	model.insertLink({"label": sLabel, "url": sUrl}, function (err, result) {
		if (err) {
			statusResponse = new StatusResponse('error', 'insertLink', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'insertLink', '', 'business', result);
		}
		callback(err, statusResponse);
	});
}

function deleteLink(sId, callback) {
	var statusResponse;
	model.deleteLink(sId, function (err, result) {
		if (err) {
			statusResponse = new StatusResponse('error', 'deleteLink', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'deleteLink', '', 'business', result);
		}
		callback(err, statusResponse);
	});
}

/*function updateResidenceSchedule (oBooking) {
 var statusResponse;
 var aResidenceSchedule = [];
 var idxResidenceElement = -1;
 var oResidenceElement;
 var sResidenceType = '';
 var dtFirstArrival = null;
 var firstDaySec;
 var dtArrive;			//full date time
 var dtDepart;
 var dArrive;			//H,M,S set to 0, for use in compare
 var dDepart;
 var dCur;
 var aSections = [appConstants.NIGHT, appConstants.MORNING, appConstants.AFTERNOON, appConstants.EVENING];
 var idxDaySection = 0;
 var j = 0;

 var oResidence;
 var memberCur = {};

 oBooking.index = 0;
 dtArrive = oBooking.arrive;
 dtDepart = oBooking.depart;
 dArrive = dtArrive.clone();
 dArrive.setHours(0);
 dArrive.setMinutes(0);
 dDepart = dtDepart.clone();
 dDepart.setHours(0);
 dDepart.setMinutes(0);
 if (true) {
 idxDaySection = 0;
 dtFirstArrival = dtArrive;
 dCur = dtFirstArrival.clone();
 dCur.setHours(0);
 dCur.setMinutes(0);
 firstDaySec = utils.getDaySection(dtArrive);
 while (firstDaySec.index !== idxDaySection) {	//create elements so that we always start with the night section
 oResidence = new DaySectionResidence(aResidenceSchedule.length, dCur, aSections[idxDaySection]);
 oResidence.members = new EmptyMembersArray();
 oResidence.guestRoomRequestCount = oBooking.guestRoomRequestCount;
 aResidenceSchedule.push(oResidence);

 idxDaySection = (idxDaySection === 3) ? 0 : idxDaySection + 1;
 }
 sResidenceType = '';
 while (dCur.isBefore(dDepart) || (dCur.equals(dDepart) && idxDaySection <= utils.getDaySection(dtDepart).index)) {
 if (dCur.equals(dArrive) && idxDaySection === utils.getDaySection(dtArrive).index) {
 sResidenceType = 'arrive';
 }
 else if (dCur.equals(dDepart) && idxDaySection === utils.getDaySection(dtDepart).index) {
 sResidenceType = 'depart';
 }
 else {
 sResidenceType = 'resident';
 }
 memberCur = new ResidentMember(oBooking, sResidenceType);
 oResidence = new DaySectionResidence(aResidenceSchedule.length, dCur, aSections[idxDaySection]);
 oResidence.members = new EmptyMembersArray();
 oResidence.members[oBooking.member.order] = memberCur;
 oResidence.guestRoomRequestCount = oBooking.guestRoomRequestCount;
 aResidenceSchedule.push(oResidence);

 idxDaySection = (idxDaySection === 3) ? 0 : idxDaySection + 1;
 if (idxDaySection === 0) {																		//change days, reset vars
 dCur = dCur.add(1).days();
 }
 }
 model.saveResidenceSchedule(aResidenceSchedule, function (err, result) {
 logger.info('here');
 })
 }

 }*/

function getResidenceSchedule(filterSpec, dateSpec, fieldSpec, callback) {
	model.getResidenceSchedule(dateSpec, callback);
}

function rebuildResidenceSchedule(filterSpec, dateSpec, fieldSpec, callback) {
	model.clearResidenceSchedule(function () {
		buildResidenceSchedule(filterSpec, dateSpec, fieldSpec, callback);
	})
}

function buildResidenceSchedule(filterSpec, dateSpec, fieldSpec, callback) {
	var statusResponse;
	var aResidenceSchedule = [];
	var idxResidenceElement = -1;
	var oResidenceElement;
	var sResidenceType = '';
	var dtFirstArrival = null;
	var guestRoomRequestCount = 0;
	var firstDaySec;
	var dtArrive;			//full date time
	var dtDepart;
	var dArrive;			//H,M,S set to 0, for use in compare
	var dDepart;
	var dCur;
	//var aSections = [appConstants.NIGHT, appConstants.MORNING, appConstants.AFTERNOON, appConstants.EVENING];
	var idxDaySection = 0;
	var j = 0;

	var oResidence;
	var roomCur = {};
	fieldSpec = fieldSpec || {};																							//send an empty object if parameter not provided
	model.listBookings(filterSpec, dateSpec, null, fieldSpec, function (err, aBookings) {
		var oBooking;
		if (err) {
			statusResponse = new StatusResponse('error', 'listBookings', '', 'business', err);
		}
		else {
			aResidenceSchedule = buildEmptySchedule(aBookings);
			for (var i = 0; i < aBookings.length; i++) {
				idxDaySection = 0;
				oBooking = aBookings[i];
				oBooking.index = i;
				guestRoomRequestCount += oBooking.guestRoomRequestCount;
				dtArrive = oBooking.arrive;
				dtDepart = oBooking.depart;
				dArrive = dtArrive.clone();
				dArrive.setHours(0);
				dArrive.setMinutes(0);
				dDepart = dtDepart.clone();
				dDepart.setHours(0);
				dDepart.setMinutes(0);

				dCur = dtArrive.clone();
				dCur.setHours(0);
				dCur.setMinutes(0);
				idxDaySection = utils.getDaySection(dtArrive).index;
				idxResidenceElement = aResidenceSchedule.length;
				oResidenceElement = null;
				for (j = 0; j < aResidenceSchedule.length; j++) {														//find the first overlapping residence record index
					if (aResidenceSchedule[j].dt.equals(dCur)
							&& aResidenceSchedule[j].daySection.index === idxDaySection) {
						idxResidenceElement = j;
						oResidenceElement = aResidenceSchedule[idxResidenceElement];
						dCur = oResidenceElement.dt.clone();
						break;
					}
				}

				sResidenceType = '';


				//Start incrementing daySections and days (dCur), updating the appropriate room with a residence status.
				if (oBooking.member.abr2 === 'AR') {
					console.log('stop');
				}
				while (dCur.isBefore(dDepart) || (dCur.equals(dDepart) && idxDaySection <= utils.getDaySection(dtDepart).index)) {
					if (dCur.equals(dArrive) && idxDaySection === utils.getDaySection(dtArrive).index) {
						sResidenceType = 'arrive';
					}
					else if (dCur.equals(dDepart) && idxDaySection === utils.getDaySection(dtDepart).index) {
						sResidenceType = 'depart';
					}
					else {
						sResidenceType = 'resident';
					}
					roomCur = new ResidentRoom(oBooking, sResidenceType);

					if (idxResidenceElement < aResidenceSchedule.length) {													//find an existing element
						oResidenceElement.rooms[oBooking.room.order] = roomCur;
						idxResidenceElement++;
						if (aResidenceSchedule[idxResidenceElement]) {
							idxDaySection = aResidenceSchedule[idxResidenceElement].daySection.index;
							oResidenceElement = aResidenceSchedule[idxResidenceElement];
							dCur = oResidenceElement.dt;
						}
						else {
							idxDaySection = (idxDaySection === 3) ? 0 : idxDaySection + 1;
							if (idxDaySection === 0) {																		//change days, reset vars
								dCur = dCur.add(1).days();
							}
						}
					}
				}
			}//for (var i = 0; i < aBookings.length

			statusResponse = new StatusResponse('success', 'listBookings', '', 'business', aResidenceSchedule);
		}

		model.saveResidenceSchedule(aResidenceSchedule, function (err, results) {
			console.log('residence schedule UPDATED');
			callback(err, statusResponse);
		});

	});
}

function buildEmptySchedule(aBookings) {
	var aResidenceSchedule = [];
	var dtFirstArrival;
	var dtLastDepart = new Date(0);
	var oResidence;
	var aSections = [appConstants.NIGHT, appConstants.MORNING, appConstants.AFTERNOON, appConstants.EVENING];

	if (!aBookings || aBookings.length === 0) {
		dtFirstArrival = new Date();
		dtLastDepart = new Date(dtFirstArrival).add(1).days();
	}
	else {
		dtFirstArrival = new Date(aBookings[0].arrive);
		aBookings.forEach(function (oBooking) {
			if (oBooking.depart.isAfter(dtLastDepart)) {
				dtLastDepart = oBooking.depart;
			}
		});
		dtLastDepart = dtLastDepart.add(1).days();
	}
	var dCur = dtFirstArrival.clone();
	dCur.setHours(0);
	dCur.setMinutes(0);
	var idxDaySection = 0;

	while (dCur.isBefore(dtLastDepart)) {
		oResidence = new DaySectionResidence(aResidenceSchedule.length, dCur, aSections[idxDaySection]);
		oResidence.rooms = new EmptyRoomsArray();
		aResidenceSchedule.push(oResidence);
		idxDaySection = (idxDaySection === 3) ? 0 : idxDaySection + 1;
		if (idxDaySection === 0) {																							//if morning, increment day
			dCur = dCur.add(1).days();
		}
	}
	return aResidenceSchedule;
}

function saveResidenceElement(oResidence) {
	model.saveResidence(oResidence, function (err, result) {
		if (err) {
			//statusResponse = new StatusResponse('error', 'bookRoom', '', 'business', err);
		}
		else {
			//statusResponse = new StatusResponse('success', 'bookRoom', '', 'business', result);
			//model.deleteBooking(result._doc._id);
			//updateResidenceSchedule(result._doc);
		}
	});
}

var DaySectionResidence = function (index, dt, daySection) {
	var dCur = new Date(dt.getTime());
	dCur.setHours(0);
	dCur.setMinutes(0);
	this.index = index;
	this.dt = dCur;
	this.sDt = dCur.toISOString();
	this.daySectionIndex = daySection.index;
	this.daySection = daySection;
	this.members = [];
	this.rooms = [];
	// this.roomRequest = 0;
};

/*
 var EmptyMembersArray = function () {
 var aMembers = [];
 var aMemberData = [
 {member: {
 "_id": "563c2368bad73ad4191aed0b",
 "llcname": "Gertrude S. Richards",
 "abr2": "TR",
 "abr3": "GSR"
 }},
 {member:{
 "_id": "563c2368bad73ad4191aed0a",
 "llcname": "Charles P. Richards, Jr.",
 "abr2": "CR",
 "abr3": "CPR"
 }},
 {member: {
 "_id": "563c2368bad73ad4191aed08",
 "llcname": "Alice E. Richards",
 "abr2": "AR",
 "abr3": "AE"
 }},
 {member: {
 "_id": "563c2368bad73ad4191aed0c",
 "llcname": "Martha C. Richards",
 "abr2": "MR",
 "abr3": "MCR"
 }},
 {member:{
 "_id": "563c2368bad73ad4191aed09",
 "llcname": "Amy Ethridge",
 "abr2": "AE",
 "abr3": "AE"
 }},
 {member:{
 "_id": "563c2368bad73ad4191aed11",
 "llcname": "Nelson T. Spratt, III",
 "abr2": "TS",
 "abr3": "NTS"
 }},
 {member:{
 "_id": "563c2368bad73ad4191aed0e",
 "llcname": "Jacquelita J. Spratt",
 "abr2": "LS",
 "abr3": "JJS"
 }},
 {member:{
 "_id": "563c2368bad73ad4191aed0d",
 "llcname": "Gwendolyn Spratt",
 "abr2": "GS",
 "abr3": "GDS"
 }},
 {member: {
 "_id": "563c2368bad73ad4191aed10",
 "llcname": "Melinda S. McKinnon",
 "abr2": "MS",
 "abr3": "MSM"
 }},
 {member: {
 "_id": "563c2368bad73ad4191aed0f",
 "llcname": "Jorgine S. Gentry",
 "abr2": "JG",
 "abr3": "JSG"
 }}
 ];
 for (var i = 0; i < aMemberData.length; i++) {
 aMembers.push(new ResidentMember(aMemberData[i]));
 }
 return aMembers;
 };
 */

//TODO: make this function dynamic from DB.
var EmptyRoomsArray = function () {
	var aRooms = [];
	var aRoomData = [
		{
			room: {
				"_id": "564b6721cd6016d444f89427",
				"defaultmember": {"id": "563c2368bad73ad4191aed0b", "abr2": "TR"},
				"order": 0,
				"number": "11",
				"unit": "A",
				"description": "Corner, back, HCA",
				"capacity": 2,
				"expandable": 1,
				"displayName": "Lakemont A11",
				"images": [
					"images/rooms/lakemonta11-1.jpg"
				],
				"member": {}
			}
		},
		{
			room: {
				"_id": "564b6504a334a3844463d1dd",
				"defaultmember": {"id": "563c2368bad73ad4191aed0a", "abr2": "CR"},
				"order": 1,
				"number": "22",
				"unit": "A",
				"description": "Corner, lake",
				"capacity": 2,
				"expandable": 0,
				"displayName": "Lakemont A22",
				"images": [
					"images/rooms/lakemonta22-1.jpg"
				]
			}
		},
		{
			room: {
				"_id": "564b65b0ac59dc8844320d9d",
				"defaultmember": {"id": "563c2368bad73ad4191aed08", "abr2": "AR"},
				"order": 2,
				"number": "23",
				"unit": "A",
				"description": "Corner, back",
				"capacity": 2,
				"expandable": 0,
				"displayName": "Lakemont A23",
				"images": [
					"images/rooms/lakemonta23-1.jpg"
				]
			}
		},
		{
			room: {
				"_id": "564b64e46d33b1544559562b",
				"defaultmember": {"id": "563c2368bad73ad4191aed0c", "abr2": "MR"},
				"order": 3,
				"number": "21",
				"unit": "A",
				"description": "Center, lake",
				"capacity": 2,
				"expandable": 0,
				"displayName": "Lakemont A21",
				"images": [
					"images/rooms/lakemonta21-1.jpg"
				]
			}
		},
		{
			room: {
				"_id": "564b65ec80fba5103bfc4954",
				"defaultmember": {"id": "563c2368bad73ad4191aed09", "abr2": "AE"},
				"order": 4,
				"number": "24",
				"unit": "A",
				"description": "Center, back",
				"capacity": 2,
				"expandable": 0,
				"displayName": "Lakemont A24",
				"images": [
					"images/rooms/lakemonta24-1.jpg"
				]
			}
		},
		{
			room: {
				"_id": "564b61fd040132ec46e5cf79",
				"defaultmember": {"id": "563c2368bad73ad4191aed11", "abr2": "TS"},
				"order": 5,
				"number": "21",
				"unit": "B",
				"description": "Center, lake",
				"capacity": 2,
				"expandable": 0,
				"displayName": "Lakemont B21",
				"images": [
					"images/rooms/lakemontb21-1.jpg"
				]
			}
		},
		{
			room: {
				"_id": "564b67488011bbec3c2f2c8b",
				"defaultmember": {"id": "563c2368bad73ad4191aed0e", "abr2": "JS"},
				"order": 6,
				"number": "11",
				"unit": "B",
				"description": "Corner, back, HCA",
				"capacity": 2,
				"expandable": 1,
				"displayName": "Lakemont B11",
				"images": [
					"images/rooms/lakemontb11-1.jpg"
				]
			}
		},
		{
			room: {
				"_id": "564b653a26c164dc46485a07",
				"defaultmember": {"id": "563c2368bad73ad4191aed0d", "abr2": "GS"},
				"order": 7,
				"number": "22",
				"unit": "B",
				"description": "Corner, lake",
				"capacity": 2,
				"expandable": 0,
				"displayName": "Lakemont B22",
				"images": [
					"images/rooms/lakemontB22-1.jpg"
				]
			}
		},
		{
			room: {
				"_id": "564b656fc237cae83cedf336",
				"defaultmember": {"id": "563c2368bad73ad4191aed10", "abr2": "MM"},
				"order": 8,
				"number": "23",
				"unit": "B",
				"description": "Corner, back",
				"capacity": 2,
				"expandable": 0,
				"displayName": "Lakemont B23",
				"images": [
					"images/rooms/lakemontB23-1.jpg"
				]
			}
		},
		{
			room: {
				"_id": "564b661754257f1446c32aa3",
				"defaultmember": {"id": "563c2368bad73ad4191aed0f", "abr2": "JG"},
				"order": 9,
				"number": "24",
				"unit": "B",
				"description": "Center, back",
				"capacity": 2,
				"expandable": 0,
				"displayName": "Lakemont B24",
				"images": [
					"images/rooms/lakemontb24-1.jpg"
				]
			}
		}
	];
	for (var i = 0; i < aRoomData.length; i++) {
		aRooms.push(new ResidentRoom(aRoomData[i]));
	}
	return aRooms;
};


var ResidentRoom = function (oBooking, residenceType) {
	this.bookingid = oBooking._id;
	this.room = (oBooking) ? oBooking.room : null;
	this.residenceType = residenceType || '';
	this.isGuest = (oBooking.guestPersonId) ? (oBooking.guestPersonId.length > 0) : false;
	var iTmp = 0;
	if (this.residenceType === 'arrive') {
		for (var i = 0; i < oBooking.guestRoomRequests.length; i++) {
			if (oBooking.guestRoomRequests[i].roomId.length === 0) {
				iTmp++;
			}
		}
		this.guestRoomRequestCount = iTmp;
	}
	if (this.residenceType === 'depart') {
		this.whoCount = oBooking.whoCount;
	}
};

function insertCollection(sCollection, callback) {
	model.insertCollection(sCollection, callback)
}

exports.isAlive = isAlive;
exports.authenticate = authenticate;
exports.loginUser = loginUser;
exports.setPassword = setPassword;
exports.resetPassword = resetPassword;
exports.getPerson = getPerson;
exports.filterPersonsByName = filterPersonsByName;
exports.listPersons = listPersons;
exports.listMembers = listMembers;
exports.listRooms = listRooms;
exports.bookRoom = bookRoom;
exports.insertPerson = insertPerson;
exports.updatePerson = updatePerson;
exports.updatePersons = updatePersons;
exports.deletePerson = deletePerson;
exports.listRoles = listRoles;
exports.listPermissions = listPermissions;
exports.updateMember = updateMember;
exports.updateBooking = updateBooking;
exports.deleteBooking = deleteBooking;
exports.listBookings = listBookings;
exports.getResidenceSchedule = getResidenceSchedule;
exports.rebuildResidenceSchedule = rebuildResidenceSchedule;
//exports.insertCollection = insertCollection;
exports.checkBookingOverlap = checkBookingOverlap;
exports.listLinks = listLinks;
exports.insertLink = insertLink;
exports.deleteLink = deleteLink;

