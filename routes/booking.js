"use strict";
var express = require('express');
var router = express.Router();
var moment = require('moment');
var business = require('../business');
var StatusResponse = require('../lib/statusResponse').StatusResponse;

router.get('/rooms', business.authenticate, function (req, res, next) {
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

router.post('/book-room', business.authenticate, function (req, res, next) {
	var sAction = req.body.action || 'insert';
	var oBooking = req.body.booking;
	business.bookRoom(sAction, oBooking, function(err, statusResponse) {
		res.send(statusResponse);
	})
});

router.get('/bookings', business.authenticate, function (req, res, next) {
	var filterSpec = null;
	var dateSpec = null;
	var field = req.query.field;
	var value = req.query.value;
	var dtFrom = req.query.from;
	var dtTo = req.query.to;
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
	if (dtFrom && dtTo) {
		dateSpec = {from: dtFrom, to: dtTo};
	}

	var sSortSpec = req.query.sortSpec;						//string representation
	var oSortSpec = null;                         //defaults to arraive date, ascending
	if (sSortSpec && sSortSpec.length > 0) {
		try {
			oSortSpec = JSON.parse(sSortSpec);
		}
		catch (err) {
			console.log('invalid sortSpec: ', sSortSpec);
		}
	}

	business.listBookings(filterSpec, dateSpec, oSortSpec, oFieldSpec, function (err, statusResponse) {
		res.send(statusResponse);
	})

});

router.get('/residence-schedule', business.authenticate, function (req, res, next) {
	var filterSpec = null;
	var dateSpec = null;
	var field = req.query.field;
	var value = req.query.value;
	var sDateSpec = req.query.dateSpec;
	var oDateSpec = null;
	if (sDateSpec && sDateSpec.length > 0) {
		try {
			oDateSpec = JSON.parse(sDateSpec);
		}
		catch (error) {
			console.log ('get/residence-schedule, error parsing dateSpec')
		}
	}
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

	business.getResidenceSchedule(filterSpec, oDateSpec, oFieldSpec, function (err, statusResponse) {
		res.send(statusResponse);
	})
});

router.get('/rebuild-residence-schedule', business.authenticate, function (req, res, next) {
	business.rebuildResidenceSchedule(null, null, null, function (err, statusResponse) {
		res.send(statusResponse);
	})
});

router.get('/check-booking-overlap', function (req, res, next) {
    var roomId = req.query.roomid;
	var dtArrive = moment(req.query.arrive, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();    //"2016-08-19T21:59:00.000Z"
	var dtDepart = moment(req.query.depart, 'YYYY-MM-DDTHH:mm:ss.SSSZ').toDate();
	business.checkBookingOverlap(roomId, dtArrive, dtDepart, function (err, statusResponse) {
		res.send(statusResponse);
	})
});

router.delete('/bookings/:oid', business.authenticate, function (req, res, next) {
	var sOId = req.params.oid || '';
	business.deleteBooking(sOId, function(err, statusResponse) {
		res.send(statusResponse);
	});
});

module.exports = router;
