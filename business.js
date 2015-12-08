/**
 * Contains business logic functions for shell app
 */
"use strict";
var StatusResponse = require('./lib/statusResponse').StatusResponse;
var utils = require('./lib/utils');
var model = require('./models/model');
var appConstants = require('./lib/appConstants');
require('datejs');														//extends the native Date object

function isAlive(callback) {
	var oData = {};
	var statusResponse = new StatusResponse('success', 'isAlive', '', 'business', oData);
	callback(null, statusResponse);

}

function loginUser(userid, password, callback) {
	model.getUser({userid : userid}, function (err, user) {
		var statusResponse;
		if (err) {
			statusResponse = new StatusResponse('error', 'loginUser', '', 'business', err);
		}
		else {
			if (!user) {
				statusResponse = new StatusResponse('fail', 'loginUser', '', 'business', {message : 'user not found'});
			}
			else {
				if (utils.compareHash(password, user.salt, user.passwordHash)) {
					delete user.passwordHash;
					delete user.salt;
					statusResponse = new StatusResponse('success', 'loginUser', '', 'business', user);
				}
				else {
					statusResponse = new StatusResponse('fail', 'loginUser', '', 'business', {message : 'incorrect password for ' + userid});
				}
			}
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
			}
			callback(err, statusResponse);
		});
	}
	else if (sAction === 'update') {
		statusResponse = new StatusResponse('error', 'bookRoom', '', 'business', 'not implemented');
		callback(err, statusResponse);
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

function listBookings(filterSpec, dateSpec, fieldSpec, callback) {
	var statusResponse;
	fieldSpec = fieldSpec || {};																							//send an empty object if parameter not provided
	model.listBookings(filterSpec, dateSpec, fieldSpec, function (err, aBookings) {
		if (err) {
			statusResponse = new StatusResponse('error', 'listBookings', '', 'business', err);
		}
		else {
			statusResponse = new StatusResponse('success', 'listBookings', '', 'business', aBookings);
		}

		callback(err, statusResponse);
	});
}

function getResidenceSchedule(filterSpec, dateSpec, fieldSpec, callback) {
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
	fieldSpec = fieldSpec || {};																							//send an empty object if parameter not provided
	model.listBookings(filterSpec, dateSpec, fieldSpec, function (err, aBookings) {
		var oBooking;
		if (err) {
			statusResponse = new StatusResponse('error', 'listBookings', '', 'business', err);
		}
		else {
			for (var i = 0; i < aBookings.length; i++) {
				idxDaySection = 0;
				oBooking = aBookings[i];
				oBooking.index = i;
				dtArrive = oBooking.arrive;
				dtDepart = oBooking.depart;
				dArrive = dtArrive.clone();
				dArrive.setHours(0);
				dArrive.setMinutes(0);
				dDepart = dtDepart.clone();
				dDepart.setHours(0);
				dDepart.setMinutes(0);
				if (dtFirstArrival === null) {																												//this is the first booking record
					idxDaySection = 0;
					dtFirstArrival = dtArrive;
					dCur = dtFirstArrival.clone();
					dCur.setHours(0);
					dCur.setMinutes(0);
					firstDaySec = utils.getDaySection(dtArrive);
					while (firstDaySec.index !== idxDaySection) {	//create elements so that we always start with the night section
						oResidence = new DaySectionResidence(aResidenceSchedule.length, dCur, aSections[idxDaySection]);
						oResidence.members = new EmptyMembersArray();
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
						aResidenceSchedule.push(oResidence);

						idxDaySection = (idxDaySection === 3) ? 0 : idxDaySection + 1;

						if (idxDaySection === 0) {																		//change days, reset vars
							dCur = dCur.add(1).days();
						}
					}
				}
				else {																																				//handle additional booking records
					dCur = dtArrive.clone();
					dCur.setHours(0);
					dCur.setMinutes(0);
					idxDaySection = utils.getDaySection(dtArrive).index;
					idxResidenceElement = aResidenceSchedule.length;
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

						if (idxResidenceElement < aResidenceSchedule.length) {
							oResidenceElement.members[oBooking.member.order] = memberCur;
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
						else {																																	//need to start adding new residence elements
							oResidence = new DaySectionResidence(aResidenceSchedule.length, dCur, aSections[idxDaySection]);
							oResidence.members = new EmptyMembersArray();
							oResidence.members[oBooking.member.order] = memberCur;
							aResidenceSchedule.push(oResidence);
							idxDaySection = (idxDaySection === 3) ? 0 : idxDaySection + 1;
							if (idxDaySection === 0) {																		//change days, reset vars
								dCur = dCur.add(1).days();
							}
						}
					}
				}

			}

			statusResponse = new StatusResponse('success', 'listBookings', '', 'business', aResidenceSchedule);
		}

		callback(err, statusResponse);
	});
}

var DaySectionResidence = function (index, dt, daySection) {
	var dCur = new Date(dt.getTime());
	dCur.setHours(0);
	dCur.setMinutes(0);
	this.index = index;
	this.dt = dCur;
	this.daySection = daySection;
	this.members = [];
};

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

var ResidentMember = function (oBooking, residenceType) {
	this.bookingid = oBooking._id;
	this.member = (oBooking) ? oBooking.member : null;
	this.residenceType = residenceType || '';
};

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
exports.updatePerson = updatePerson;
exports.updateMember = updateMember;
exports.updateBooking = updateBooking;
exports.listBookings = listBookings;
exports.getResidenceSchedule = getResidenceSchedule;
//exports.insertCollection = insertCollection;
