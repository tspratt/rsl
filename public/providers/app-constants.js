'use strict';
angular.module('rsl').constant('appConstants', {
  SERVICE_URL_BASE: 'https://rslllc.herokuapp.com/', //'http://localhost:5000/', //
  QUERY_DELAY: 300,
	MORNING: {hour: 11, minute: 59, second: 0, millisecond: 0},
	AFTERNOON: {hour: 17, minute: 59, second: 0, millisecond: 0},
	EVENING: {hour: 20, minute: 59, second: 0, millisecond: 0}
});

