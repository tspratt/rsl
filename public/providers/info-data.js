'use strict';
angular.module('rsl')
  .factory('InfoData', ['$rootScope','$http', 'envConfig', function ($rootScope, $http, envConfig) {
    var InfoData = {};

		InfoData.listLinks = function () {
			return  $http.get(envConfig.SERVICE_URL_BASE + 'links')
				.then(function (res) {
					return res.data;
				})
				.catch(function(res) {
					return res;
				});
		};

		InfoData.saveLink = function (sLabel,sUrl) {
			var oBody = { label: sLabel, url: sUrl};
			return  $http.post(envConfig.SERVICE_URL_BASE + 'links', oBody)
					.then(function (res) {
						return res.data;
					})
					.catch(function(res) {
						return res;
					});
		};

		InfoData.deleteLink = function (sOid) {
			var oQueryParams = {oid : sOid};
			var promise = $http.delete(envConfig.SERVICE_URL_BASE + 'links/' + sOid)
					.then(function (res) {
						return res.data;
					})
					.catch(function (res) {
						return res;
					});
			return promise;
		};

		return InfoData;
  }]);
