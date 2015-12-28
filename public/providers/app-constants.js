'use strict';
angular.module('rsl').constant('appConstants', {
  QUERY_DELAY: 300,
	NIGHT: {hour: 5, minute: 59, second: 0, millisecond: 0, lclabel: 'night', index: 0},
	MORNING: {hour: 11, minute: 59, second: 0, millisecond: 0, lclabel: 'morning', index: 1},
	AFTERNOON: {hour: 17, minute: 59, second: 0, millisecond: 0, lclabel: 'afternoon', index: 2},
	EVENING: {hour: 23, minute: 59, second: 0, millisecond: 0, lclabel: 'evening', index: 3},
	PARTNER: 'partner',
	CHILD: 'child',
	FRIEND: 'friend',
	OTHER: 'other'
});

