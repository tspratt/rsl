'use strict';
angular.module('rsl')
		.factory('bookingData', ['$http', 'envConfig', 'appConstants', 'appData', function ($http, envConfig, appConstants, appData) {
			var bookingData = {};

			bookingData.getBookings = function (dtFrom, dtTo, sSortSpec, sFilterFieldName, filterValue) {
				var oQueryParams = {from:dtFrom, to:dtTo, sortSpec:sSortSpec};

				var promise = $http.get(envConfig.SERVICE_URL_BASE + 'bookings',
						{params : oQueryParams})
						.then(function (res) {
							return res;
						})
						.catch(function (res) {
							//console.error('getBookings', res.status, res.data);
							return res;
						});
				return promise;
			};

			bookingData.getResidenceSchedule = function (oQuerySpec, oDateSpec, oFieldspec) {
				var oQueryParams = {querySpec: oQuerySpec, dateSpec: oDateSpec, fieldSpec: null};
				var promise = $http.get(envConfig.SERVICE_URL_BASE + 'residence-schedule',
						{params : oQueryParams})
						.then(function (res) {
							return res;
						})
						.catch(function (res) {
							return res;
						});
				return promise;
			};

			bookingData.rebuildResidenceSchedule = function (oQuerySpec, oDateSpec, oFieldspec) {
				var oQueryParams = {querySpec: oQuerySpec, dateSpec: oDateSpec, fieldSpec: null};
				var promise = $http.get(envConfig.SERVICE_URL_BASE + 'rebuild-residence-schedule',
						{params : oQueryParams})
						.then(function (res) {
							return res;
						})
						.catch(function (res) {
							return res;
						});
				return promise;
			};

			bookingData.checkBookingOverlap = function (roomid, dtArrive, dtDepart) {
				var oQueryParams = {roomid: roomid, arrive:dtArrive, depart:dtDepart};
				var promise = $http.get(envConfig.SERVICE_URL_BASE + 'check-booking-overlap/',
						{params : oQueryParams})
						.then(function (res) {
							return res;
						})
						.catch(function (res) {
							//console.error('checkBookingOverlap', res.status, res.data);
							return res;
						});
				return promise;
			};

			bookingData.getBooking = function (sOid) {
				var oQueryParams = {oid : sOid};
				var promise = $http.get(envConfig.SERVICE_URL_BASE + 'bookings/' + sOid,
						{params : oQueryParams})
						.then(function (res) {
							return res;
						})
						.catch(function (res) {
							//console.error('getBooking', res.status, res.data);
							return res;
						});
				return promise;
			};

			bookingData.getRooms = function (iPageNum, iPageLen, sFilterFieldName, filterValue, bReducedPayload) {
				var oQueryParams = {
					pageNum    : iPageNum,
					pageLength : iPageLen,
					field      : sFilterFieldName,
					value      : filterValue
				};
				var promise = $http.get(envConfig.SERVICE_URL_BASE + 'rooms',
						{params : oQueryParams})
						.then(function (res) {
							return res;
						})
						.catch(function (res) {
							//console.error('getPersons', res.status, res.data);
							return res;
						});
				return promise;
			};

			bookingData.bookRoom = function (mode, oBooking) {
				var oBody = {action : (mode === 'new')? 'insert':'update', booking : oBooking};
				var promise = $http.post(envConfig.SERVICE_URL_BASE + 'book-room', oBody)
						.then(function (res) {
							return res;
						})
						.catch(function (res) {
							//console.error('loginUser', res.status, res.data);
							return res;
						});
				return promise;
			};

			bookingData.deleteBooking = function (sOid) {
				var oQueryParams = {oid : sOid};
				var promise = $http.delete(envConfig.SERVICE_URL_BASE + 'bookings/' + sOid,
						{params : oQueryParams})
						.then(function (res) {
							return res;
						})
						.catch(function (res) {
							//console.error('deleteBooking', res.status, res.data);
							return res;
						});
				return promise;
			};


			return bookingData;
		}]);
