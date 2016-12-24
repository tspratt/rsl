"use strict";
var express = require('express');
var router = express.Router();
var business = require('../business');
var StatusResponse = require('../lib/statusResponse').StatusResponse;

router.post('/links', business.authenticate, function (req, res, next) {
	business.insertLink(req.body.label, req.body.url, function(err, statusResponse) {
		res.send(statusResponse);
	});
});

router.get('/links', business.authenticate, function (req, res, next) {
	business.listLinks(function(err, statusResponse) {
		res.send(statusResponse);
	});
});

router.delete('/links/:oid', business.authenticate, function (req, res, next) {
	var sOId = req.params.oid || '';
	business.deleteLink(sOId, function(err, statusResponse) {
		res.send(statusResponse);
	});
});
module.exports = router;
