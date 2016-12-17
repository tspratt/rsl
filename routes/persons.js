"use strict";
var express = require('express');
var router = express.Router();
var StatusResponse = require('../lib/statusResponse').StatusResponse;
var business = require('../business');

router.get('/isAlive', function (req, res, next) {
	business.isAlive(function(err, statusResponse) {
    res.send(statusResponse);
  });
});

router.get('/persons', business.authenticate, function (req, res, next) {
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
});

router.get('/persons/:oid', business.authenticate, function (req, res, next) {
  var sOId = req.params.oid || '';
  business.getPerson(sOId, function(err, statusResponse) {
    res.send(statusResponse);
  });
});

router.put('/person', business.authenticate, function (req, res, next) {
  var oUpdate = req.body.update;
	var sId = oUpdate._id;
  business.updatePerson(sId, oUpdate, function(err, statusResponse) {
    res.send(statusResponse);
  });
});

router.delete('/persons/:oid', business.authenticate, function (req, res, next) {
  var sOId = req.params.oid || '';
  business.deletePerson(sOId, function(err, statusResponse) {
    res.send(statusResponse);
  });
});

router.post('/person', business.authenticate, function (req, res, next) {
	var oPerson = req.body.person;
	business.insertPerson(oPerson, function(err, statusResponse) {
		res.send(statusResponse);
	});
});

router.get('/permissions', business.authenticate, function (req, res, next) {
  var orderBy = req.query.orderBy;
  business.listPermissions(orderBy, function(err, statusResponse) {
    res.send(statusResponse);
  });
});

router.get('/roles', business.authenticate, function (req, res, next) {
  business.listRoles(function(err, statusResponse) {
    res.send(statusResponse);
  });
});


module.exports = router;
