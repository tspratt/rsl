"use strict";
var StatusResponse = require('../lib/statusResponse').StatusResponse;
var business = require('../business');

function isAlive(request, response){
  business.isAlive(function(err, statusResponse) {
    response.json(statusResponse);
  });
}

function listPersons(req, res, next) {
  var sQuery = req.query.query;
	var oQuery = (sQuery)? JSON.parse(sQuery):{};
	var filterSpec = null;
  var pageSpec = null;
  var field = req.query.field;
  var value = req.query.value;
  var pageNum = req.query.pageNum;
  var pageLength = req.query.pageLength;
  var matchstring = req.query.matchstring;
  var sFieldSpec = req.query.fieldSpec;						//string representation
  var oFieldSpec = {};																//parsed object
  if (sFieldSpec) {
    try {
      oFieldSpec = JSON.parse(sFieldSpec);
    }
    catch (error){
      var statusResponse = new StatusResponse('error','invalid fieldSpec parameter','','routes.listPersons',{config:sFieldSpec});
      res.send(statusResponse);
      return;
    }
  }
  else {
    oFieldSpec = {"ssn": 0};
  }

  if (matchstring) {
    business.filterPersonsByName(matchstring, oFieldSpec, function (err, statusResponse) {
      res.send(statusResponse);
    });
  }
  else {
    if (field && value) {
      filterSpec = {field: field, value: value};
    }

    if (pageNum && pageLength) {
      pageSpec = {pageLength: parseInt(pageLength), pageNum: parseInt(pageNum)};
    }

    business.listPersons(oQuery, filterSpec, pageSpec, oFieldSpec, function (err, statusResponse) {
      res.send(statusResponse);
    })
  }
}

function getPerson(request, response) {
  var sOId = request.params.oid || '';
  business.getPerson(sOId, function(err, statusResponse) {
    response.send(statusResponse);
  });
}

exports.getPerson = getPerson;
exports.isAlive = isAlive;
exports.listPersons = listPersons;
