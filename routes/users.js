"use strict";
var express = require('express');
var router = express.Router();
var business = require('../business');
var StatusResponse = require('../lib/statusResponse').StatusResponse;

router.post('/loginUser', function (req, res, next) {
	var userid = req.body.userid;
	var pwd = req.body.password;
	business.loginUser(userid, pwd,
			function (err, statusResponse) {
				res.send(statusResponse);
			});
});

router.post('/setpassword', function (req, res, next) {
	var userid = req.body.userid;
	var oldPassword = req.body.password;
	var newPassword = req.body.newPassword;
	business.setPassword(userid, oldPassword, newPassword,
			function (err, statusResponse) {
				res.send(statusResponse);
			});
});
module.exports = router;
