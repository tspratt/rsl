'use strict';
angular.module('rsl')
  .factory('bookingData', ['$http', 'appConstants', 'appData', function ($http, appConstants, appData) {
    var bookingData = {};

    bookingData.getBookings = function (dateEarliest, dateLatest) {
      var oQueryParams = {dateEarliest: dateEarliest, dateLatest: dateLatest};

      var promise =  $http.get(appConstants.SERVICE_URL_BASE + 'bookings',
        {params: oQueryParams})
        .then(function (res) {
          return res;
        })
        .catch(function(res) {
          console.error('getBookings', res.status, res.data);
          return res;
        });
      return promise;
    };


    bookingData.getBooking = function (sOid) {
      var oQueryParams = {oid: sOid};
      var promise =  $http.get(appConstants.SERVICE_URL_BASE + 'bookings/' + sOid,
        {params: oQueryParams})
        .then(function (res) {
          return res;
        })
        .catch(function(res) {
          console.error('getBooking', resp.status, res.data);
          return res;
        });
      return promise;
    };

    bookingData.getRooms = function (iPageNum, iPageLen,sFilterFieldName, filterValue, bReducedPayload) {
      var oQueryParams = {pageNum: iPageNum, pageLength: iPageLen, field:sFilterFieldName, value: filterValue};
      var promise =  $http.get(appConstants.SERVICE_URL_BASE + 'rooms',
          {params: oQueryParams})
          .then(function (res) {
            return res;
          })
          .catch(function(res) {
            console.error('getPersons', res.status, res.data);
            return res;
          });
      return promise;
    };

    bookingData.bookRoom = function (oBooking) {
      var oBody = oBooking;
      var promise =  $http.post(appConstants.SERVICE_URL_BASE + 'book', oBody)
          .then(function (res) {
            return res;
          })
          .catch(function(res) {
            console.error('loginUser', res.status, res.data);
            return res;
          });
      return promise;
    };


    return bookingData;
  }]);
