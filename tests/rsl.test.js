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
	} catch(e) {
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
						function (err){
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
				model.listMembers(null,null, null,
						function (err, members) {
							asyncAssertionCheck(done, function () {
								//expect(err).to.not.exist;
								//expect(statusResponse.data).to.exist;
								//expect(statusResponse.data).to.be.an.array;
								console.log(JSON.stringify(members,null,2))
							});
						}
				);
			});
			it('should return a list of all persons', function (done) {
				business.listPersons(null,null, null,
					function (err, statusResponse) {
						asyncAssertionCheck(done, function () {
							expect(err).to.not.exist;
							expect(statusResponse.data).to.exist;
							expect(statusResponse.data).to.be.an.array;
							expect(statusResponse.data.length).to.be.greaterThan(0);
							console.log(JSON.stringify(statusResponse.data,null,2))
						});
					}
				);
			});

				it.skip('should return a page of persons, filtered by branch=Spratt', function (done) {
				var filterSpec = {field:'branchid', value: 'Spratt'};
				var pageSpec = {pageLength:50, pageNum: 0};
				business.listPersons(filterSpec,pageSpec, null,
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
				business.filterPersonsByName(matchString, {llcname:1},
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
		}
	);

});
