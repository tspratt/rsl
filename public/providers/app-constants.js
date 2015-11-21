'use strict';
angular.module('rsl').constant('appConstants', {
  SERVICE_URL_BASE: 'http://localhost:5000/', //'https://rslllc.herokuapp.com/', //,
  QUERY_DELAY: 300,
	MORNING: [11,59,0,0],
	AFTERNOON: [5,59,0,0],
	EVENING: [23,59,0,0]
});

