"use strict";
var StatusResponse = require('../lib/statusResponse').StatusResponse;
var business = require('../business');

function isAlive(request, response){
  business.isAlive(function(err, statusResponse) {
    response.json(statusResponse);
  });
}

function listMembers(req, res, next) {
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
      var statusResponse = new StatusResponse('error','invalid fieldSpec parameter','','routes.listMembers',{config:sFieldSpec});
      res.send(statusResponse);
      return;
    }
  }
  else {
    oFieldSpec = {"ssn": 0};
  }

  if (matchstring) {
    business.filterMembersByName(matchstring, oFieldSpec, function (err, statusResponse) {
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

    business.listMembers(filterSpec, pageSpec, oFieldSpec, function (err, statusResponse) {
      res.send(statusResponse);
    })
  }
};

function getMember(request, response) {
  var sOId = request.params.oid || '';
  business.getMember(sOId, function(err, statusResponse) {
    response.send(statusResponse);
  });
}

exports.getMember = getMember;
exports.isAlive = isAlive;
exports.listMembers = listMembers;
