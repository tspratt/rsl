'use strict';
angular.module('rsl')
  .factory('appData', ['$http', '$localStorage', 'envConfig', function ($http, $localStorage, envConfig) {
    var storage = $localStorage;
    var appData = {};

    appData.loggedInUser = {};
    appData.members = [];
    appData.rooms = [];
		appData.auth = {};
    appData.allPersons = [];

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

    appData.loadPreferences = function () {
      for (var preference in storage) {
        if (storage.hasOwnProperty(preference) && typeof storage[preference] !== 'function') {
          appData.preferences[preference] = storage[preference];
        }
      }
    };
    appData.preferences = {rememberMe:false, username:'', password:'', defaultPrevState:true, prevState:''};
    appData.setPreference = function (sPreferenceName, value) {
      appData.preferences[sPreferenceName] = value;
      storage[sPreferenceName] = value;
    };
    appData.getPreference = function (sPreferenceName) {
      return appData.preferences[sPreferenceName] || '';
    };

    return appData;
  }]);
