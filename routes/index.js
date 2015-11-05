var express = require('express');
var router = express.Router();
var business = require('../business');

/* GET home page. */
router.get('/', function(req, res, next) {
  business.isAlive(function(err, statusResponse) {
    res.writeHead(200, 'success', {'Content-Type':'application/json', 'Access-Control-Allow-Origin':'*'});
    res.end(statusResponse);
  });
});

router.get('/members', function(req, res, next) {
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
});
router.get('/members/:oid', function(req, res, next) {
  var sOId = req.params.oid || '';
  business.getMember(sOId, function(err, statusResponse) {
    res.send(statusResponse);
  });
});

module.exports = router;
