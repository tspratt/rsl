'use strict';
angular.module('rsl')
  .factory('bookingData', ['$http', 'appConstants', function ($http, appConstants) {
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


    return bookingData;
  }]);
