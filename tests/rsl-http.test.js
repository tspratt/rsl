"use strict";
var chai = require("chai");
var expect = chai.expect;
var request = require('request');
var port = 5000;
var ObjectId = require('mongodb').ObjectID;
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

describe('REST http tests', function () {
	this.timeout(0);

	describe('Test isAlive (routes)',
			function () {
				it('should return success status response', function (done) {
					request.get('http://localhost:' + port + '/isAlive',
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(body).to.exist;
									var oBody = JSON.parse(body);
									expect(oBody.status).to.equal('success');
								});
							}
					);
				});
			}
	);

	describe('Test Users endpoints (routes)',
			function () {
				it('should return a person from login with good credentials', function (done) {
					var doc = {"userid": "Tracy", "password": "gabboob"};
					request({url: 'http://localhost:' + port + '/loginUser/', method: 'POST', json: doc},
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(body).to.exist;
									var statusResponse = body;
									expect(statusResponse.status).to.equal('success');
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data.person).to.exist;
								});
							}
					);
				});
				it('should fail login with bad credentials', function (done) {
					var doc = {"userid": "Tracy", "password": "xxxxx"};
					request({url: 'http://localhost:' + port + '/loginUser/', method: 'POST', json: doc},
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(body).to.exist;
									var statusResponse = body;
									expect(statusResponse.status).to.equal('fail');
									expect(statusResponse.data.person).to.not.exist;
								});
							}
					);
				});
			}
	);

	describe('Test Data Access (routes)',
			function () {
				it('should return a list of all persons', function (done) {
					request.get('http://localhost:' + port + '/persons',
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(body).to.exist;
									if (typeof body === 'string') {body = JSON.parse(body)}	//why is body sometimes object, sometimes string?
									var statusResponse = body;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									console.log(JSON.stringify(statusResponse.data, null, 2))
								});
							}
					);

				});


				it('should return a list persons for member', function (done) {
					var sQuerystring = '?query={"memberrelationship": {"$ne": "self"}}&field=member&value=563c2368bad73ad4191aed11';
					request.get('http://localhost:' + port + '/persons' + sQuerystring,
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(body).to.exist;
									if (typeof body === 'string') {body = JSON.parse(body)}	//why is body sometimes object, sometimes string?
									var statusResponse = body;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									//console.log(JSON.stringify(statusResponse.data, null, 2))
								});
							}
					);
				});

				it.skip('should return a page of persons, filtered by branch=Spratt', function (done) {
					var sQuerystring = '?field=branchid&value=Spratt&pageNum=0&pageLength=50';
					request.get('http://localhost:' + port + '/persons' + sQuerystring,
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(body).to.exist;
									if (typeof body === 'string') {body = JSON.parse(body)}	//why is body sometimes object, sometimes string?
									var statusResponse = body;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									//console.log(JSON.stringify(statusResponse.data, null, 2))
								});
							}
					);
				});
				it('should return filtered list on firstname', function (done) {
					var matchString = 'Trud';
					var sQuerystring = '?matchstring=' + matchString;
					request.get('http://localhost:' + port + '/persons' + sQuerystring,
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(body).to.exist;
									if (typeof body === 'string') {body = JSON.parse(body)}	//why is body sometimes object, sometimes string?
									var statusResponse = body;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									var elem0 = statusResponse.data[0];
									var sTmp = elem0.firstname;
									expect(sTmp.indexOf(matchString)).to.be.greaterThan(-1);  //make sure our match string is in our result somewhere
								});
							}
					);
				});
				it('should return filtered list with reduced payload', function (done) {
					var matchString = 'Trud';
					var sQuerystring = '?matchstring=' + matchString + '&fieldSpec={"llcname": 1}';
					request.get('http://localhost:' + port + '/persons' + sQuerystring,
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(body).to.exist;
									if (typeof body === 'string') {body = JSON.parse(body)}	//why is body sometimes object, sometimes string?
									var statusResponse = body;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.array;
									expect(statusResponse.data.length).to.be.greaterThan(0);
									var elem0 = statusResponse.data[0];
									expect(elem0.firstname).to.not.exist;
									var sTmp = elem0.firstname;
								});
							}
					);
				});
				it('should return a single document by Id', function (done) {
					var id = '563c1e35ef69c27818dd9167';
					request.get('http://localhost:' + port + '/persons/' + id,
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(body).to.exist;
									if (typeof body === 'string') {body = JSON.parse(body)}	//why is body sometimes object, sometimes string?
									var statusResponse = body;
									expect(statusResponse.data).to.exist;
									expect(statusResponse.data).to.be.an.object;
									expect(statusResponse.data._id.toString()).to.equal(id);
								});
							}
					);
				});



			}
	);

	describe.skip('Test Data Update REST ENDPOINTS NOT IMPLEMENTED YET (routes)',
			function () {
				it('should update a single person document by Id', function (done) {
					var id = '563c1e35ef69c27818dd916d';
					var sUpdateData = 'email-' + Date.now();
					/*
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
					*/
				});

				it('should update a single Member document by Id', function (done) {
					var id = '563c2368bad73ad4191aed11';
					var sUpdateData = 'ns3';
					/*
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
					*/
				});
			});

	describe.skip('Test Booking endpoints (routes)',
			function () {
				var aBookings;
				var booking;

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
				it('should NOT return a booking overlap id', function (done) {
					var memberId = '563c2368bad73ad4191aed11';
					var dtArrive = new Date(2015,10,1); //11-1
					var dtDepart = new Date(2015,10,6);	//11-6
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
					var dtArrive = new Date(2015,10,1); //11-1
					var dtDepart = new Date(2016,0,1);	//1/1
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
					var dtArrive = new Date(2015,10,1);//11-1
					var dtDepart = new Date(2015,11,1);	//12-1
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
					var dtArrive = new Date(2015,11,1);		//12-1
					var dtDepart = new Date(2015,11,10);	//12-10
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
					var dtArrive = new Date(2015,10,30);		//11-30
					var dtDepart = new Date(2015,11,4);			//12-4
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


});
