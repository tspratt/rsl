"use strict";
var chai = require("chai");
var expect = chai.expect;
var packageJson = require('../package.json');
var model = require('../models/model');
var ObjectId = require('mongodb').ObjectID;
var business = require('../business');
var smsClient = require('../smsClient');
var StatusResponse = require('../lib/statusResponse').StatusResponse;
var prevValue = '';

function asyncAssertionCheck(done, f) {
	try {
		f();
		done();
	} catch (e) {
		done(e);
	}
}

describe('Setup tests', function () {
	this.timeout(0);
	before(function (done) {
		var uri = process.env.ATLAS_URI;
		model.initDb(uri,
				function (err) {
					if (err) {
						var statusResponse = new StatusResponse('error', 'System Error. Please try again', '', 'initDb', err);
						console.log(JSON.stringify(statusResponse));
						done(err);
					}
					else {
						console.log('initDb SUCCESS');
						model.initMgDb(uri,
								function (err) {
									if (err) {
										var statusResponse = new StatusResponse('error', 'System Error. Please try again', '', 'initDb', err);
										console.log(JSON.stringify(statusResponse));
									}
									else {
										console.log('initMgDb success')
									}
									done();
								});
					}
				}
		);
	});//before

	/*

	 */

	describe('Test isAlive (business)',
			function () {
				it('should return a success status response', function (done) {
					business.isAlive(
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.status).to.equal('success');
								});
							}
					);
				});
			}
	);

	describe('Test Link functionality',
			function () {
				var iLinkCount = 0;
				var sIdTmp = '';

				it('should List links link', function (done) {
					business.listLinks(
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									iLinkCount = statusResponse.data.length;
								});
							}
					);
				});

				it('should save a link', function (done) {
					var sLabel = 'Test Link label';
					var sUrl = 'https://www.google.com/';
					business.saveLink(sLabel, sUrl,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.status).to.equal('success');
									sIdTmp = statusResponse.data._doc._id.toString()
								});
							}
					);
				});
				it('should List links, including test link', function (done) {
					var sLabel = 'Test Link label';
					var sUrl = 'https://www.google.com/';
					business.listLinks(
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data.length).to.be.greaterThan(iLinkCount);
								});
							}
					);
				});
				it('should delete a link', function (done) {
					var sUrl = 'https://www.google.com/';
					business.deleteLink(sIdTmp,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.status).to.equal('success');
								});
							}
					);
				});
				it('should List links, expecting original count', function (done) {
					var sLabel = 'Test Link label';
					var sUrl = 'https://www.google.com/';
					business.listLinks(
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data.length).to.be.equal(iLinkCount);
								});
							}
					);
				});

			}
	);


	describe.skip('Test SMS Messaging',
			function () {
				var iTmp = 0;
				it('should send a text to 7706331912', function (done) {
					var toNumber = '7706331912';
					smsClient.sendMessage(toNumber, 'this is a test message from the RSL application',
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.status).to.equal('success');
									expect(statusResponse.data.toNumber).to.exist;
									expect(statusResponse.data.toNumber).to.equal(toNumber);
								});
							}
					);
				});
				it('should send a text to 7706331912 and 11', function (done) {
					var toNumbers = ['7706331912','7706331911'];
					smsClient.sendMessages(toNumbers, 'this is a test message from the RSL application, sent to ' + toNumbers.join(' | '),
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data.responses).to.exist;
									expect(statusResponse.data.responses.length).to.equal(2);
								});
							}
					);
				});
				it('should return an array of phone numbers', function (done) {
					var sAction = 'login_app';
					model.listSMSNumbers(sAction,
							function (err, aData) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(aData).to.exist;
									expect(aData).to.be.an.array;
									expect(aData.length).to.be.greaterThan(0);
									iTmp = aData.length;
								});
							}
					);
				});
				it('should send a text to persons with SMS action_login_app', function (done) {
					var sAction = 'send_chat';
					var userid = 'TracyTest';
					smsClient.sendActionMessages(sAction, userid,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data.responses).to.exist;
									expect(statusResponse.data.responses.length).to.equal(iTmp);
								});
							}
					);
				});
			}
	);

	describe('Test Users endpoints (business)',
			function () {
				it('should return a person from login with good credentials', function (done) {
					business.loginUser('Tracy', 'gabboob',
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.status).to.equal('success');
									expect(statusResponse.data.person.member.unit).to.exist;
									console.log(statusResponse.data);
								});
							}
					);
				});
				it('should fail login with bad credentials', function (done) {
					business.loginUser('Tracy', 'xxxxx',
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.status).to.equal('fail');
								});
							}
					);
				});
				it('should set password', function (done) {
					business.setPassword('Amy', 'gabboob', 'amy',
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.status).to.equal('success');
								});
							}
					);
				});
				it('should return a person from login with good credentials', function (done) {
					business.loginUser('Amy', 'amy',
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.status).to.equal('success');
									expect(statusResponse.data.person.member.unit).to.exist;
									console.log(statusResponse.data);
								});
							}
					);
				});
				it('should re-set password', function (done) {
					business.resetPassword('Amy',
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.status).to.equal('success');
								});
							}
					);
				});
				it('should log in successfully', function (done) {
					business.loginUser('Amy', 'gabboob',
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.status).to.equal('success');
								});
							}
					);
				});
			}
	);

	describe('Test Data Access (business)',
			function () {
				it('should return a list of all members', function (done) {
					business.listMembers(null, null, null,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									console.log(JSON.stringify(statusResponse.data, null, 2))
								});
							}
					);
				});
				it('should return a list of members by branch id', function (done) {
					business.listMembers({
								field: "branch",
								value: new ObjectId("563c2429404d259013af4a8a")
							}, null, null,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									console.log(JSON.stringify(statusResponse.data, null, 2))
								});
							}
					);
				});

				it('should return a list of all persons', function (done) {
					business.listPersons(null, null, null, null,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									console.log(JSON.stringify(statusResponse.data, null, 2))
								});
							}
					);
				});

				it('should return a list persons for member', function (done) {
					business.listPersons({memberrelationship: {$ne: "self"}}, {
								field: 'member',
								value: "563c2368bad73ad4191aed11"
							}, null, null,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									console.log(JSON.stringify(statusResponse.data, null, 2))
								});
							}
					);
				});

				it('should return a page of persons, filtered by branch=Spratt', function (done) {
					var filterSpec = {field: 'branchid', value: 'Spratt'};
					var pageSpec = {pageLength: 50, pageNum: 0};
					business.listPersons(null, filterSpec, pageSpec, null,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(2);
								});
							}
					);
				});
				it('should return filtered list on firstname', function (done) {
					var matchString = 'Trud';
					business.filterPersonsByName(matchString, {},
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									var elem0 = statusResponse.data[0];
									//var _id= elem0._id.toString();
									var sTmp = elem0.firstname;
									expect(sTmp.indexOf(matchString)).to.be.greaterThan(-1);  //make sure our match string is in our result somewhere
									console.log(statusResponse.data);
								});
							}
					);
				});
				it('should return filtered list with reduced payload', function (done) {
					var matchString = 'Trud';
					business.filterPersonsByName(matchString, {llcname: 1},
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data[0].ssn).to.not.exist;
									console.log(statusResponse.data);
								});
							}
					);
				});
				it('should return a single document by Id', function (done) {
					var id = '563c1e35ef69c27818dd9167';
					business.getPerson(id,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.data._id.toString()).to.equal(id);  //make sure our match string is in our result somewhere
									console.log(statusResponse.data);
								});
							}
					);
				});

				it('should update a single person document by Id', function (done) {
					var id = '563c1e35ef69c27818dd916d';
					var sUpdateData = 'tracy';
					business.updatePerson(id, {role: sUpdateData},
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.status).to.equal('success');
								});
							}
					);
				});

				/***************** dev only! *************************
				 it('should update multiple person documents', function (done) {
					var id = '563c1e35ef69c27818dd916d';
					var oQuery ={"memberrelationship":"friend"};
					var oUpdate = {role: 'user', "permissions": ["view_persons","view_bookings","view_schedule","view_book"]};
					business.updatePersons(oQuery, oUpdate,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.status).to.equal('success');
								});
							}
					);
				});
				 ***************** dev only! *************************/

				it('should updte a single Member document by Id', function (done) {
					var id = '563c2368bad73ad4191aed11';
					var sUpdateData = 'ns3';
					business.updateMember(id, {abr3: sUpdateData},
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.status).to.equal('success');
								});
							}
					);
				});

				it('should return a list of Rooms for Unit "A"', function (done) {
					business.listRooms({"field": "unit", "value": "A"}, null, null,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									console.log(JSON.stringify(statusResponse.data, null, 2))
								});
							}
					);
				});
			}
	);

	describe.only('Test User methods (business)',
			function () {
				it('should create a user from a person', function (done) {
					var personId = '565541adcdba9a58074181a3';
					business.createUserFromPerson(personId,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.data.person.toString()).to.equal(personId);  //make sure our match string is in our result somewhere
									prevValue = statusResponse.data._id.toString();
								});
							}
					);
				});

				it('should get a user by id', function (done) {
					var userId = prevValue;
					business.getUserById(userId,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.data._id.toString()).to.equal(userId);  //make sure our match string is in our result somewhere
								});
							}
					);
				});

				it('should delete a user by id', function (done) {
					var userId = prevValue;
					business.deleteUser(userId,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
								});
							}
					);
				});

				it('should fail to find a user by id', function (done) {
					var userId = prevValue;
					business.getUserById(userId,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.equal('');
								});
							}
					);
				});
			}
	);

	describe('Test Roles and Permissions',
			function () {
				it('should return a list of all Roles', function (done) {
					business.listRoles(
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
								});
							}
					);
				});

				it('should return a list of all Permissions by action', function (done) {
					business.listPermissions('action',
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									expect(statusResponse.data[0].name).to.equal('add_booking');
								});
							}
					);
				});

				it('should return a list of all Permissions by context', function (done) {
					business.listPermissions('context',
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									expect(statusResponse.data[0].name).to.equal('view_book');
								});
							}
					);
				});
			}
	);
	describe('Test Booking endpoints (business)',
			function () {
				var aBookings;
				var booking;
				it('should NOT return a booking overlap id', function (done) {
					var memberId = '563c2368bad73ad4191aed11';
					var dtArrive = new Date(2015, 10, 1); //11-1
					var dtDepart = new Date(2015, 10, 6);	//11-6
					business.checkBookingOverlap(memberId, dtArrive, dtDepart,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.have.length(0);
								});
							}
					);
				});
				it('should return a booking overlap id surrounded', function (done) {
					var memberId = '563c2368bad73ad4191aed11';
					var dtArrive = new Date(2015, 10, 1); //11-1
					var dtDepart = new Date(2016, 0, 1);	//1/1
					business.checkBookingOverlap(memberId, dtArrive, dtDepart,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.data).to.have.property('_id');
									expect(statusResponse.data._id).to.be.not.null
								});
							}
					);
				});
				it('should return a booking overlap id on the front', function (done) {
					var memberId = '563c2368bad73ad4191aed11';
					var dtArrive = new Date(2015, 10, 1);//11-1
					var dtDepart = new Date(2015, 11, 1);	//12-1
					business.checkBookingOverlap(memberId, dtArrive, dtDepart,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.data).to.have.property('_id');
									expect(statusResponse.data._id).to.be.not.null
								});
							}
					);
				});
				it('should return a booking overlap id on the back', function (done) {
					var memberId = '563c2368bad73ad4191aed11';
					var dtArrive = new Date(2015, 11, 1);		//12-1
					var dtDepart = new Date(2015, 11, 10);	//12-10
					business.checkBookingOverlap(memberId, dtArrive, dtDepart,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.data).to.have.property('_id');
									expect(statusResponse.data._id).to.be.not.null
								});
							}
					);
				});
				it('should return a booking overlap id enclosed', function (done) {
					var memberId = '563c2368bad73ad4191aed11';
					var dtArrive = new Date(2015, 10, 30);		//11-30
					var dtDepart = new Date(2015, 11, 4);			//12-4
					business.checkBookingOverlap(memberId, dtArrive, dtDepart,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.data).to.have.property('_id');
									expect(statusResponse.data._id).to.be.not.null
								});
							}
					);
				});
				it('should return an array of all bookings ', function (done) {
					business.listBookings(null, null, null,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									prevValue = statusResponse.data.length;
									aBookings = statusResponse.data;
									booking = aBookings[0];
								});
							}
					);
				});
				it('should return an array of bookings for a single member', function (done) {
					business.listBookings({
								field: 'member',
								value: '563c2368bad73ad4191aed11'
							}, null, null,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.lessThan(prevValue);
									console.log(JSON.stringify(statusResponse.data, null, 2))
								});
							}
					);
				});
				it('should return an array of bookings for a date range', function (done) {
					business.listBookings(null, {
								from: '2015-11-29T22:59:00.000Z',
								to: '2015-11-30T22:59:00.000Z'
							}, null,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.lessThan(prevValue);
									console.log(JSON.stringify(statusResponse.data, null, 2))
								});
							}
					);
				});
				it('should update a single booking document by Id', function (done) {
					var id = booking._id;
					var sUpdateData = booking.note + 'test data: ' + Date.now();
					business.updateBooking(id, {note: sUpdateData},
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.status).to.equal('success');
								});
							}
					);
				});
				it('should generate and return an array of residence records', function (done) {
					business.rebuildResidenceSchedule(null, null, null,
							function (err, statusResponse) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									var aRes = statusResponse.data;
									var oRes;
									var memb1;
									var memb2;
									var memb3;
									var dtLabel;
									for (var i = 0; i < aRes.length; i++) {
										oRes = aRes[i];
										memb1 = oRes.members[1].member || {};
										memb2 = oRes.members[2].member || {};
										memb3 = oRes.members[3].member || {};
										var mbmb1label = (memb1.llcname || '') + ':' + (oRes.members[1].residenceType || '');
										var mbmb2label = (memb2.llcname || '') + ':' + (oRes.members[2].residenceType || '');
										var mbmb3label = (memb3.llcname || '') + ':' + (oRes.members[3].residenceType || '');
										console.log(i, oRes.dt, oRes.daySection.lclabel, mbmb1label + ' | ' + mbmb2label + '|' + mbmb3label)
									}
								});
							}
					);
				});
			}
	);

	/*
	 describe('insert item data',
	 function () {
	 it('should return an schema object', function (done) {
	 model.insertItem(
	 function (err, sItemJson) {
	 asyncAssertionCheck(done, function () {
	 expect(err).to.not.exist;
	 expect(sItemJson).to.exist;
	 console.log(sItemJson);
	 });
	 }
	 );
	 });
	 }
	 );
	 */

	/*
	 describe.only('set a property',
	 function () {
	 it('should return an schema object', function (done) {
	 setProperty(
	 function (err, sItemJson) {
	 asyncAssertionCheck(done, function () {
	 expect(err).to.not.exist;
	 expect(sItemJson).to.exist;
	 console.log(sItemJson);
	 });
	 }
	 );
	 });
	 }
	 );

	 */
	/*
	 describe('insert item data',
	 function () {
	 it('should return an schema object', function (done) {
	 model.createUsers(
	 function (err, sItemJson) {
	 asyncAssertionCheck(done, function () {
	 expect(err).to.not.exist;
	 expect(sItemJson).to.exist;
	 console.log(sItemJson);
	 });
	 }
	 );
	 });
	 }
	 );
	 */
});
