"use strict";
var express = require('express');
var router = express.Router();
var business = require('../business');
var StatusResponse = require('../lib/statusResponse').StatusResponse;

router.get('/loginUser', function (req, res, next) {
	console.log(JSON.stringify(req.query, null, 2));
	var userid = req.query.userid;
	var pwd = req.query.password;
	business.loginUser(userid, pwd,
			function (err, statusResponse) {
				res.send(statusResponse);
			});
});
module.exports = router;
