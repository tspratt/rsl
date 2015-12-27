'use strict';
angular.module('rsl')
  .factory('appData', ['$http', 'envConfig', function ($http, envConfig) {
    var appData = {};

    appData.loggedInUser = {};



    return appData;
  }]);
