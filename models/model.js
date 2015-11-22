/**
 * this file does the work of communicating with the Mongo database.
 */
'use strict';

var StatusResponse = require('../lib/statusResponse').StatusResponse;
var winston = require('winston');
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({'timestamp': true, level: 'info'})
	]
});
var utils = require('../lib/utils');

//var async = require('async');
var fs = require("fs");
var mgSchema = require('./mg-schema').mgSchema;
var mongoDb = require('mongodb');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var _db;
var mgDb;

var Converter = require("csvtojson").Converter;
var converter = new Converter({});


function initDb(uri, callback) {
	logger.info('model.initDb: uri', uri);
	var statusResponse;
	mongoDb.MongoClient.connect(uri, function (err, db) {
		if (err) {
			statusResponse = new StatusResponse('error', "System Error, please try again", '', null, err);
			logger.error(JSON.stringify(statusResponse));
			callback(err, {modelName: 'mgoModel', dbName: 'shades'});
		}
		else {
			logger.info('mongodb connected');
			_db = db;
			callback(err, {modelName: 'model', dbName: ''});
		}
	});
}//

function initMgDb(uri, callback) {
	logger.info('model.initDb: uri', uri);
	var statusResponse;
	mongoose.connect(uri);
	mgDb = mongoose.connection;
	mgDb.on('error', function (err) {
		statusResponse = new StatusResponse('error', "System Error, please try again", '', null, err);
		logger.error(JSON.stringify(statusResponse));
		callback(err, {modelName: 'mgoModel', dbName: 'shades'});
	});
	mgDb.once('open', function () {
		logger.info('Mongoose connected');
		initMgModels();
		callback(null, {});
	});
}

function initMgModels() {
	for (var schema in mgSchema) {
		mongoose.model(schema, mgSchema[schema]);
	}

}

function listPersons(oQuery, filterSpec, pageSpec, oFieldSpec, callback) {
	oQuery = oQuery || {};
	oFieldSpec = oFieldSpec || {};
	var iSkip = 0;
	var iLimit = 0;
	if (pageSpec) {
		iSkip = pageSpec.pageNum * pageSpec.pageLength;
		iLimit = pageSpec.pageLength;
	}

	if (filterSpec) {
		//var sQuery = '{"' + filterSpec.field + '":"' + filterSpec.value + '"}';
		oQuery[filterSpec.field] = filterSpec.value;
		//oQuery = JSON.parse(sQuery);
	}
	mongoose.model('Person').find(oQuery, oFieldSpec, {memberrelationship: 1})
			.skip(iSkip)
			.limit(iLimit)
			.deepPopulate('member.branch')
			.lean()
			.exec(function (err, persons) {
				if (err) {
					callback(err, null);
				} else {
					callback(null, persons);
				}
			});
}

function filterPersonsByName(matchString, oFieldSpec, callback) {
	var oQuery = {
		$or: [
			{"firstname": new RegExp(matchString, 'i')},
			{"lastname": new RegExp(matchString, 'i')}
		]
	};
	mongoose.model('Person').find(oQuery, oFieldSpec)
			.deepPopulate('member.branch')
			.lean()
			.exec(function (err, persons) {
				mongoose.model('Person').populate(persons, {
							path: 'member.branch',
							model: 'Branch'
						},
						function (err, persons) {
							if (err) {
								callback(err, null);
							} else {
								callback(null, persons);
							}
						});

			});

}


/**
 * run only once for a new collection!
 */
function insertCollection(sCollection, callback) {
	converter.on("end_parsed", function (jsonArray) {
		//var omember;
		//var sId;
		//for (var i = 0; i < jsonArray.length; i++) {
		//  omember = jsonArray[i];
		//  sId = omember.personid
		//  omember.personid = ObjectId(sId);
		//}

		_db.collection(sCollection, {safe: true},
				function (err, collection) {
					collection.insert(jsonArray, function (err, data) {
						if (err) {
							callback(err, null);
						} else {
							callback(null, data);
						}
					});
				});
	});
	fs.createReadStream('./data/' + sCollection + '.csv').pipe(converter);
}

function getUser(oQuery, callback) {
	mongoose.model('User').findOne(oQuery)
			.deepPopulate('person.member.branch')
			.lean()
			.exec(function (err, persons) {
					if (err) {
						callback(err, null);
					} else {
						callback(null, persons);
					}
			});
}

function getPerson(id, callback) {
	var oId = new ObjectId(id);
	mongoose.model('Person').findOne({_id: oId})
			.deepPopulate('member.branch')
			.lean()
			.exec(function (err, persons) {
				mongoose.model('Person').populate(persons, {
							path: 'member.branch',
							model: 'Branch'
						},
						function (err, persons) {
							if (err) {
								callback(err, null);
							} else {
								callback(null, persons);
							}
						});

			});
}

function listMembers(filterSpec, pageSpec, oFieldSpec, callback) {
	var iSkip = 0;
	var iLimit = 0;
	if (pageSpec) {
		iSkip = pageSpec.pageNum * pageSpec.pageLength;
		iLimit = pageSpec.pageLength;
	}
	var oQuery = {};
	if (filterSpec) {
		var sQuery = '{"' + filterSpec.field + '":"' + filterSpec.value + '"}';
		oQuery = JSON.parse(sQuery);
	}

	mongoose.model('Member').find(oQuery, oFieldSpec)
			.skip(iSkip)
			.limit(iLimit)
			.populate('branch')
			.lean()
			.exec(function (err, persons) {
				if (err) {
					callback(err, null);
				} else {
					callback(null, persons);
				}
			});
}

function listRooms(filterSpec, pageSpec, oFieldSpec, callback) {
	var iSkip = 0;
	var iLimit = 0;
	if (pageSpec) {
		iSkip = pageSpec.pageNum * pageSpec.pageLength;
		iLimit = pageSpec.pageLength;
	}
	var oQuery = {};
	if (filterSpec) {
		var sQuery = '{"' + filterSpec.field + '":"' + filterSpec.value + '"}';
		oQuery = JSON.parse(sQuery);
	}

	mongoose.model('Room').find(oQuery, oFieldSpec)
			.skip(iSkip)
			.limit(iLimit)
			.populate('branch')
			.lean()
			.exec(function (err, persons) {
				if (err) {
					callback(err, null);
				} else {
					callback(null, persons);
				}
			});
}

/*
function insertItem(callback) {
	var ItemModel = mongoose.model('Unit');
	var item = new ItemModel({
		property: 'Lakemont',
		number: 'B',
		description: 'East wing',
		capacity: '14',
		expandable: '5',
		branchid: ObjectId('563c2429404d259013af4a8b'),
		images: ['images/units/lakemontb-1.jpg']
	});
	item.save(function (err) {
		callback(err, JSON.stringify(item, null, 2));
	})
}
*/

/*
function setProperty(callback) {
	try {
		_db.collection('rooms', {safe: true},
				function (err, collection) {
					collection.update({}, {
								$set: {
									"property": 'Lakemont'
								}
							},
							function (err, data) {
								if (err) {
									callback(err, null);
								} else {
									callback(null, data);
								}
							});
				})
	}
	catch (err) {
		callback(err, undefined);
	}
}
*/

/*
function createUsers(callback) {
	var salt = utils.generateSalt();
	var password = 'gabboob';

	listPersons(null, null, null,
			function (err, persons) {
				var aUsers = [];
				var doc;
				var User = mongoose.model('User');
				for (var i = 1; i < persons.length; i++) {
					var person = persons[i];
					doc = new User({
						personid: person._id,
						userid: person.firstname,
						passwordHash: utils.buildHash(password, salt),
						salt: salt
					});
					doc.save();
				}

			}
	);
}
*/
exports.getUser = getUser;
exports.getPerson = getPerson;
exports.filterPersonsByName = filterPersonsByName;
exports.listPersons = listPersons;
exports.db = _db;
exports.mgDb = mgDb;
exports.initDb = initDb;
exports.initMgDb = initMgDb;
exports.insertCollection = insertCollection;
//exports.createUsers = createUsers;
exports.listMembers = listMembers;
exports.listRooms = listRooms;
//exports.setProperty = setProperty;

