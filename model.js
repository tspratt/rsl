/**
 * this file does the work of communicating with the Mongo database.
 */
'use strict';

var StatusResponse = require('./lib/statusResponse').StatusResponse;
var winston = require('winston');
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({'timestamp': true, level: 'info'})
  ]
});

//var async = require('async');
var fs = require("fs");
var mongoDb = require('mongodb');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
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
    callback(null, {});
  });
}

function listPersons(filterSpec, pageSpec, oFieldSpec, callback) {
  var oPerson;
  _db.collection('persons', {safe: true},
    function (err, collection) {
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
      var aPersons = collection.find(oQuery, oFieldSpec)
        .skip(iSkip)
        .limit(iLimit)
        .toArray(function (err, data) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, data);
          }
        });
    });
}

function filterPersonsByName(matchString, oFieldSpec, callback) {
  var oPerson;
  _db.collection('persons', {safe: true},
    function (err, collection) {
      var aPersons = collection.find({$or:[
        {"firstname": new RegExp(matchString,'i')},
        {"lastname": new RegExp(matchString,'i')}
      ]}, oFieldSpec)
        .toArray(function (err, data) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, data);
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


function getPerson(id, callback) {
  var oPerson;
  _db.collection('persons', {safe: true},
    function (err, collection) {
      var oId = new ObjectId(id);
      collection.findOne({_id: oId}, function (err, data) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    });

}


exports.getPerson = getPerson;
exports.filterPersonsByName = filterPersonsByName;
exports.listPersons = listPersons;
exports.db = _db;
exports.mgDb = mgDb;
exports.initDb = initDb;
exports.initMgDb = initMgDb;
exports.insertCollection = insertCollection;


