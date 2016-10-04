'use strict';
angular.module('rsl')
  .factory('appData', ['$http', 'envConfig', function ($http, envConfig) {
    var appData = {};

    appData.loggedInUser = {};
    appData.members = [];
    appData.rooms = [];

    appData.getDaySection  = function(dt) {
      var sReturn = 'evening';
      var hour = dt.hour();
      if (hour <= appConstants.MORNING.hour) {
        sReturn = 'morning';
      }
      else if (hour <= appConstants.AFTERNOON.hour) {
        sReturn = 'afternoon';
      }
      return sReturn;
    };

    return appData;
  }]);
