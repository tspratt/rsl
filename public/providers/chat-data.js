'use strict';
angular.module('rsl')
  .factory('chatData', ['$http', 'envConfig', function ($http, envConfig) {
    var chatData = {};

    chatData.getMessages  = function(isoDtFrom) {
      var oQueryParams = {from: isoDtFrom};
      var promise =  $http.get(envConfig.SERVICE_URL_BASE + 'messages',
          {params: oQueryParams})
          .then(function (res) {
            return res;
          })
          .catch(function(res) {
            console.error('getMessages', resp.status, res.data);
            return res;
          });
      return promise;
    };

    return chatData;
  }]);
