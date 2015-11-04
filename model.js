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

var mongoDb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var _db;

var Converter = require("csvtojson").Converter;
var converter = new Converter({});


function initDb(uri, callback) {
    logger.info('model.initDb: uri', uri);
    var statusResponse;
    mongoDb.MongoClient.connect(uri,function (err, db) {
        if(err) {
            statusResponse = new StatusResponse('error', "System Error, please try again", '', null, err);
            logger.error(JSON.stringify(statusResponse));
            callback(err, {modelName: 'mgoModel', dbName: 'shades'});
        }
        else {
          logger.info('mongodb connected');
            _db = db;
            callback(err, {modelName: 'model', dbName: ''});
        }
    })
}//

/*
function listMembers(filterSpec, pageSpec, oFieldSpec, callback){
    var oMember;
    db.collection('members', {safe: true},
      function(err, collection){
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
          var aMembers = collection.find(oQuery, oFieldSpec)
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

function filterMembersByName(matchString, oFieldSpec, callback){
    var oMember;
    db.collection('members', {safe: true},
      function(err, collection){
          var aMembers = collection.find({$or:[
            {"first_name": new RegExp(matchString,'i')},
            {"last_name": new RegExp(matchString,'i')}
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
*/

/**
 * run only once for a new collection!
 */

function parseJson () {
    var sCollection = 'members';
    converter.on("end_parsed", function (jsonArray) {
        console.log(jsonArray); //here is your result jsonarray
        insertData(sCollection, jsonArray);
    });
    require("fs").createReadStream('./data/' + sCollection + '.csv').pipe(converter);
}
function insertData(sCollection, json){
    _db.collection(sCollection, {safe: true},
      function(err, collection){
          collection.insert(json, function (err, data) {
              if (err) {
                  callback(err, null);
              } else {
                  callback(null, data);
              }
          });
      });

}


function getMember(id, callback){
  var oMember;
  db.collection('members', {safe: true},
    function(err, collection){
      var oId = new ObjectId(id);
      collection.findOne({_id: oId},function (err, data) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    });

}




//exports.getMember = getMember;
//exports.filterMembersByName = filterMembersByName;
//exports.listMembers = listMembers;
exports.db = _db;
exports.initDb = initDb;
//exports.insertMembers = insertMembers;


