'use strict';
angular.module('rsl')
  .factory('appData', ['$http', 'envConfig', 'PersonData', function ($http, envConfig, PersonData) {
    var appData = {};

    appData.loggedInUser = {};
    appData.members = [];
    appData.rooms = [];
		appData.auth = {};
		appData.persons = null;

		appData.getAllPersons = function () {
		  if (!appData.persons) {
        PersonData.getPersons(null, null, null, null, null, false)
        .then(function (res) {
          if (res.status >= 200 && res.status < 300) {
            appData.persons = res.data.data;
          }
          else {
            console.log('HTTP Error: ' + res.statusText);
          }
        });
      }
    };

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
