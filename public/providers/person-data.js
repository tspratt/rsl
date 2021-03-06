'use strict';
angular.module('rsl')
  .factory('PersonData', ['$rootScope','$http', 'envConfig', function ($rootScope, $http, envConfig) {
    var PersonData = {};

    PersonData.loginUser = function (userid, password) {
      var oBody = {userid: userid, password: password};

      var promise =  $http.post(envConfig.SERVICE_URL_BASE + 'loginUser', oBody)
          .then(function (res) {
            return res;
          })
          .catch(function(res) {
            //console.error('loginUser', res.status, res.data);
            return res;
          });
      return promise;
    };

		PersonData.setPassword = function (userid, password, newPassword) {
			var oBody = {userid: userid, password: password, newPassword: newPassword};

			var promise =  $http.post(envConfig.SERVICE_URL_BASE + 'setpassword', oBody)
					.then(function (res) {
						return res;
					})
					.catch(function(res) {
						//console.error('setpassword', res.status, res.data);
						$rootScope.$emit('system-message', {source: 'person-data.js', level: 'service-error', message: 'Service error setting password'});
						return res;
					});
			return promise;
		};

    PersonData.getPersons = function (iPageNum, iPageLen, oQuery, sFilterFieldName, filterValue, bReducedPayload) {
      var oQueryParams = {pageNum: iPageNum, pageLength: iPageLen, query: oQuery, field:sFilterFieldName, value: filterValue};
      if (bReducedPayload) {
        oQueryParams.fieldSpec = '{"ssn": 0}';
      }
      var promise =  $http.get(envConfig.SERVICE_URL_BASE + 'persons',
        {params: oQueryParams})
        .then(function (res) {
          return res;
        })
        .catch(function(res) {
          //console.error('getPersons', res.status, res.data);
          return res;
        });
      return promise;
    };


    PersonData.getPersonsByNameMatch = function (sMatchString) {
      var oQueryParams = {matchstring: sMatchString};
      var promise =  $http.get(envConfig.SERVICE_URL_BASE + 'persons',
        {params: oQueryParams})
        .then(function (res) {
          return res;
        })
        .catch(function(res) {
          //console.error('getPersonsByNameMatch', res.status, res.data);
          return res;
        });
      return promise;
    };

    PersonData.getPerson = function (sOid) {
      var oQueryParams = {oid: sOid};
      var promise =  $http.get(envConfig.SERVICE_URL_BASE + 'persons/' + sOid,
        {params: oQueryParams})
        .then(function (res) {
          return res;
        })
        .catch(function(res) {
          //console.error('getPerson', res.status, res.data);
          return res;
        });
      return promise;
    };

		PersonData.savePerson = function (oUpdate) {
			var oBody = { update: oUpdate};
			var promise =  $http.put(envConfig.SERVICE_URL_BASE + 'person', oBody)
					.then(function (res) {
						return res;
					})
					.catch(function(res) {
						//console.error('savePerson', res.status, res.data);
						return res;
					});
			return promise;
		};

		PersonData.deletePerson = function (sOid) {
			var oQueryParams = {oid: sOid};
			var promise =  $http.delete(envConfig.SERVICE_URL_BASE + 'persons/' + sOid,
					{params: oQueryParams})
					.then(function (res) {
						return res;
					})
					.catch(function(res) {
						//console.error('getPerson', res.status, res.data);
						return res;
					});
			return promise;
		};

		PersonData.getRoles = function () {
			var promise =  $http.get(envConfig.SERVICE_URL_BASE + 'roles/')
					.then(function (res) {
						return res;
					})
					.catch(function(res) {
						//console.error('getPerson', res.status, res.data);
						return res;
					});
			return promise;
		};

		PersonData.getPermissions = function () {
			var oQueryParams = {orderBy: 'action'};
			var promise =  $http.get(envConfig.SERVICE_URL_BASE + 'permissions/',oQueryParams)
					.then(function (res) {
						return res;
					})
					.catch(function(res) {
						//console.error('getPerson', res.status, res.data);
						return res;
					});
			return promise;
		};
    return PersonData;
  }]);
