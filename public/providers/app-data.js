'use strict';
angular.module('rsl')
  .factory('appData', ['$http', 'appConstants', function ($http, appConstants) {
    var appData = {};

    appData.loggedInUser = {};



    return appData;
  }]);
