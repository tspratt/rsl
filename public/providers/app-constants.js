'use strict';
angular.module('rsl').constant('appConstants', {
  SERVICE_URL_BASE: 'http://localhost:5000/',	//'https://rslllc.herokuapp.com/', // //
  QUERY_DELAY: 300,
	MORNING: {hour: 11, minute: 59, second: 0, millisecond: 0},
	AFTERNOON: {hour: 17, minute: 59, second: 0, millisecond: 0},
	EVENING: {hour: 20, minute: 59, second: 0, millisecond: 0},
	PARTNER: 'partner',
	CHILD: 'child',
	FRIEND: 'friend',
	OTHER: 'other'
});

