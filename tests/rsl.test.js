"use strict";
var chai = require("chai");
var expect = chai.expect;
var packageJson = require('../package.json');
var model = require('../models/model');
var ObjectId = require('mongodb').ObjectID;
var business = require('../business');

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
		var uri = process.env.MONGOLAB_URI;
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
								field : "branch",
								value : new ObjectId("563c2429404d259013af4a8a")
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
					business.listPersons({memberrelationship : {$ne : "self"}}, {
								field : 'member',
								value : "563c2368bad73ad4191aed11"
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

				it.skip('should return a page of persons, filtered by branch=Spratt', function (done) {
					var filterSpec = {field : 'branchid', value : 'Spratt'};
					var pageSpec = {pageLength : 50, pageNum : 0};
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
					business.filterPersonsByName(matchString, {llcname : 1},
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

				it('should updte a single person document by Id', function (done) {
					var id = '563c1e35ef69c27818dd916d';
					var sUpdateData = 'email-' + Date.now();
					business.updatePerson(id, {email: sUpdateData},
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
					business.listRooms({"field" : "unit", "value" : "A"}, null, null,
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

	describe('Test Booking endpoints (business)',
			function () {
				var aBookings;
				var booking;
				it('should return an array of all bookings', function (done) {
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
									console.log(JSON.stringify(statusResponse.data, null, 2))
								});
							}
					);
				});
				it('should return an array of bookings for a single member', function (done) {
					business.listBookings({
								field : 'member',
								value : '563c2368bad73ad4191aed11'
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
								from : '2015-11-29T22:59:00.000Z',
								to   : '2015-11-30T22:59:00.000Z'
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
				it('should return an array of residence records', function (done) {
					business.getResidenceSchedule(null, null, null,
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
										console.log(i, oRes.dt, oRes.daySection.lclabel, mbmb1label + ' | ' + mbmb2label + '|' +  mbmb3label)
									}
								});
							}
					);
				});
			}
	);

	/*
	 describe.skip('insert item data',
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
					model.setProperty(
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
	 describe.skip('insert item data',
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
