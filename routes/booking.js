"use strict";
var express = require('express');
var router = express.Router();
var business = require('../business');
var StatusResponse = require('../lib/statusResponse').StatusResponse;

router.get('/rooms', function (req, res, next) {
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
		catch (error) {
			var statusResponse = new StatusResponse('error', 'invalid fieldSpec parameter', '', 'routes.listRooms', {config: sFieldSpec});
			res.send(statusResponse);
			return;
		}
	}
	else {
		oFieldSpec = {};
	}


	if (field && value) {
		filterSpec = {field: field, value: value};
	}
	if (pageNum && pageLength) {
		pageSpec = {pageLength: parseInt(pageLength), pageNum: parseInt(pageNum)};
	}

	business.listRooms(filterSpec, pageSpec, oFieldSpec, function (err, statusResponse) {
		res.send(statusResponse);
	})

});

router.post('/book-room', function (req, res, next) {
	var sAction = req.body.action || 'insert';
	var oBooking = req.body.booking;
	business.bookRoom(sAction, oBooking, function(err, statusResponse) {
		res.send(statusResponse);
	})
});

module.exports = router;
