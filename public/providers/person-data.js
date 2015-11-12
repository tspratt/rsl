'use strict';
angular.module('rsl')
  .factory('PersonData', ['$http', 'appConstants', function ($http, appConstants) {
    var PersonData = {};


    PersonData.getMembers = function (iPageNum, iPageLen,sFilterFieldName, filterValue, bReducedPayload) {
      var oQueryParams = {pageNum: iPageNum, pageLength: iPageLen, field:sFilterFieldName, value: filterValue};
      if (bReducedPayload) {
        oQueryParams.fieldSpec = '{"ssn": 0}';
      }
      var promise =  $http.get(appConstants.SERVICE_URL_BASE + 'members',
        {params: oQueryParams})
        .then(function (res) {
          return res;
        })
        .catch(function(res) {
          console.error('getMembers', res.status, res.data);
          return res;
        });
      return promise;
    };


    PersonData.getMembersByNameMatch = function (sMatchString) {
      var oQueryParams = {matchstring: sMatchString};
      var promise =  $http.get(appConstants.SERVICE_URL_BASE + 'members',
        {params: oQueryParams})
        .then(function (res) {
          return res;
        })
        .catch(function(res) {
          console.error('getMembersByNameMatch', resp.status, res.data);
          return res;
        });
      return promise;
    };

    PersonData.getMember = function (sOid) {
      var oQueryParams = {oid: sOid};
      var promise =  $http.get(appConstants.SERVICE_URL_BASE + 'members/' + sOid,
        {params: oQueryParams})
        .then(function (res) {
          return res;
        })
        .catch(function(res) {
          console.error('getMember', resp.status, res.data);
          return res;
        });
      return promise;
    };


    return PersonData;
  }]);
