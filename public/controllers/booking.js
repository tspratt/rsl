angular.module('rsl')
.controller('bookingCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$location', '$anchorScroll', 'appConstants', 'appData', 'bookingData', 'PersonData',
	function ($rootScope, $scope, $state, $stateParams, $location, $anchorScroll, appConstants, appData, bookingData, personData) {
		$scope.rooms = [];
		$scope.bookings = [];
		$scope.residenceSchedule = [];
		$scope.booking = {};
		$scope.canBook = (appData.loggedInUser.role !== 'demo');
		$scope.bookMember = appData.loggedInUser.person.member;
		$scope.bookMemberId = appData.loggedInUser.person.member._id;
		$scope.selectedRoom = null;
		$scope.dtArrive = null;
		$scope.dtDepart = null;
		$scope.booking.who = [];
		$scope.guestCount = 0;
		$scope.roomRequestCount = 0;
		$scope.note = '';

		$scope.dtArriveMin = Date.now();
		$scope.dtDepartMin = Date.now();
		$scope.departDisabled = true;
		$scope.dtArriveTimeConfig = appConstants.AFTERNOON;
		$scope.dtDepartTimeConfig = appConstants.EVENING;
		$scope.appConstants = appConstants;
		$scope.arriveDaySection = 'Afternoon';
		$scope.departDaySection = 'Evening';
		$scope.dtArriveLabel = '';
		$scope.dtDepartLabel = '';
		$scope.arriveDetail = false;	//controls visibility of detail section
		$scope.departDetail = false;
		$scope.whoDetail = false;
		var aExpanders = ['arriveDetail', 'departDetail', 'whoDetail'];
		$scope.whoCount = 0;
		$scope.personsForMember = [];
		$scope.members = [];
		$scope.addingPerson = false;
		$scope.bookingIncomplete = true;
		$scope.bookingSelected = {};
		$scope.bookingDetailShow = false;
		$scope.bookingMode = 'new';
		$scope.initialData;
		$scope.activestate = $state.$current.name;

		function initModule() {
			console.log('stateparams:', $stateParams.booking);
			var sTmp = '';
			if ($state.$current.name === 'book') {
				$scope.initialData = $stateParams.data;
				if ($scope.initialData) {
					$scope.bookingMode = $scope.initialData.mode;
					if ($scope.initialData.mode === 'new') {
						$scope.bookMemberId = $scope.initialData.memberid;			//there will always be a memberid if we are launched from the booking schedule
						$scope.dtArrive = new Date($scope.initialData.arrive);
					}
					else if ($scope.initialData.mode === 'change') {
						$scope.booking = $scope.initialData.booking;
						$scope.bookMember = $scope.initialData.booking.member;
						$scope.dtArrive = new Date($scope.initialData.booking.arrive);
						$scope.dtDepart = new Date($scope.initialData.booking.depart);
						$scope.note = $scope.initialData.booking.note;
						$scope.bookMemberId = $scope.initialData.booking.member._id;			//there will always be a memberid if we are launched from the booking schedule
					}

				}
				getBookings();    //necessary for lookups
				getRooms();
				getMembers();
			}
			else if ($state.$current.name === 'booking-schedule') {
				getBookings();    //necessary for lookups
				getResidenceSchedule(null, {from: moment().subtract(1, 'days').toISOString()});
			}
			else if ($state.$current.name === 'booking-list') {
				getBookings();
			}
		}

		$scope.$watch('bookMember', function (member) {
			if (member) {
				$scope.selectedRoom = null;				//set these so they blank out immediately on member change
				$scope.personsForMember = [];
				getPersonsForMember(member._id);
				getRooms();
			}
		});

		$scope.$watch('dtArrive', function (newValue, oldValue) {
			if (newValue) {
				$scope.departDisabled = false;
				if (!newValue._isAMomentObject) {
					$scope.dtArrive = moment(newValue);
				}
				$scope.dtArrive.set($scope.dtArriveTimeConfig);
				$scope.dtArriveLabel = $scope.dtArrive.format('dddd') + ' ' + getDaySection($scope.dtArrive) + ', ' + $scope.dtArrive.format('M/D');
				if ($scope.dtDepart && $scope.dtDepart.isBefore($scope.dtArrive)) {
					$scope.dtDepart = null;
				}
				checkBooking();
			}
			else {
				$scope.departDisabled = true;
				$scope.dtArriveLabel = '';
				$scope.bookingIncomplete = true;
			}
		});

		$scope.$watch('dtDepart', function (newValue, oldValue) {
			if (newValue) {
				if (!newValue._isAMomentObject) {
					$scope.dtDepart = moment(newValue);
				}
				$scope.dtDepart.set($scope.dtDepartTimeConfig);
				$scope.dtDepartLabel = $scope.dtDepart.format('dddd') + ' ' + getDaySection($scope.dtDepart) + ', ' + $scope.dtDepart.format('M/D');
				checkBooking();
			}
			else {
				$scope.dtDepartLabel = '';
				$scope.bookingIncomplete = true;
			}
		});

		$scope.$watch('personsForMember', function (newValue) {
			$scope.whoCount = 0;
			for (var i = 0; i < $scope.personsForMember.length; i++) {
				if ($scope.personsForMember[i].selected) {
					$scope.whoCount++;
				}
			}
			checkBooking();
		}, true);

		$scope.$watch('arriveDetail', function (newValue) {
			if (newValue === true) {
				$location.hash('arriveDetail');		// the element you wish to scroll to.
				$anchorScroll();						// call $anchorScroll()
				collapseOthers('arriveDetail');
			}
		});

		$scope.$watch('departDetail', function (newValue) {
			if (newValue === true) {
				$location.hash('departDetail');		// the element you wish to scroll to.
				$anchorScroll();						// call $anchorScroll()
				collapseOthers('departDetail');
			}
		});

		$scope.$watch('whoDetail', function (newValue) {
			if (newValue === true) {
				$location.hash('whoDetail');		// the element you wish to scroll to.
				$anchorScroll();						// call $anchorScroll()
				collapseOthers('whoDetail');
			}
		});

		function collapseOthers(sExpCur) {
			for (var i = 0; i < aExpanders.length; i++) {
				var sName = aExpanders[i];
				if (sName !== sExpCur) {
					$scope[sName] = false;
				}
			}
		}

		function checkBooking() {
			$scope.bookingIncomplete = !$scope.dtArrive || !$scope.dtDepart || ($scope.whoCount === 0);
			if ($scope.bookingMode === 'new' && $scope.dtArrive && $scope.dtDepart) {
				bookingData.checkBookingOverlap($scope.selectedRoom, $scope.dtArrive, $scope.dtDepart)
				.then(function (res) {
					if (res.status >= 200 && res.status < 300) {
						if (res.data.data.hasOwnProperty('_id')) {
							console.log('Booking dates overlap: ' + res.data.data.arrive);
							$rootScope.$emit('system-message', {
								source: 'booking.js',
								level: 'critical',
								message: 'Selected dates overlap, please change or edit existing booking'
							});
							$scope.bookingIncomplete = true;
							//$scope.dtArrive = null;
							//$scope.dtDepart = null;
							//var booking = res.data.data;
							//changeBooking(booking);
							//$state.go('booking-schedule');
						}
						else {
							//do nothing
						}
					}
					else {
						console.log('HTTP Error: ' + res.statusText);
					}

				});
			}
		}

		/*
		 $scope.gridOptions = {
		 data: 'bookings',
		 columnDefs: [
		 {field: 'member.llcname', displayName: 'member', width: 90},
		 {field: 'room.displayName', displayName: 'Room', width: 80},
		 {field: 'arrive', displayName: 'Arrive'}
		 ]
		 };
		 */
		function getBookings(oQuerySpec, oDateSpec, oFieldSpec) {
			$scope.booking = null;
			$scope.selectedId = '';
			bookingData.getBookings(oQuerySpec, oDateSpec, oFieldSpec)
			.then(function (res) {
				if (res.status >= 200 && res.status < 300) {
					$scope.bookings = res.data.data;
				}
				else {
					console.log('HTTP Error: ' + res.statusText);
				}

			});
		}

		/**
		 *
		 * @param oQuerySpec
		 * @param oDateSpec : {from: 'isostring', to:isostring}}
		 * @param oFieldSpec
		 */
		function getResidenceSchedule(oQuerySpec, oDateSpec, oFieldSpec) {
			$scope.residenceSchedule = null;
			$scope.selectedId = '';
			bookingData.getResidenceSchedule(oQuerySpec, oDateSpec, oFieldSpec)
			.then(function (res) {
				if (res.status >= 200 && res.status < 300) {
					$scope.residenceSchedule = res.data.data;
					//console.log(JSON.stringify(res.data.data,null,2));
				}
				else {
					console.log('HTTP Error: ' + res.statusText);
				}

			});
		}

		function getRooms() {
			bookingData.getRooms(null, null, 'unit', $scope.bookMember.branch.unit, null)
			.then(function (res) {
				if (res.status >= 200 && res.status < 300) {
					$scope.rooms = res.data.data;
					setDefaultRoom();
				}
				else {
					console.log('HTTP Error: ' + res.statusText);
				}

			});
		}

		function setDefaultRoom() {
			var defaultRoomId = $scope.bookMember.defaultroom;
			if (defaultRoomId) {
				for (var i = 0; i < $scope.rooms.length; i++) {
					if ($scope.rooms[i]._id === defaultRoomId) {
						$scope.selectedRoom = $scope.rooms[i];
						break;
					}
				}
			}
		}

		function getMembers() {
			personData.getPersons(null, null, null, 'memberrelationship', 'self', null)
			.then(function (res) {
				if (res.status >= 200 && res.status < 300) {
					var aTmp = res.data.data.map(function (person) {
						return person.member;
					});

					$scope.members = aTmp;

					for (var i = 0; i < $scope.members.length; i++) {
						if ($scope.members[i]._id === $scope.bookMemberId) {
							$scope.members[i].selected = true;
							$scope.bookMember = $scope.members[i];
							break;
						}
					}

				}
				else {
					console.log('HTTP Error: ' + res.statusText);
				}

			});
		}

		function getPersonsForMember(memberid) {
			personData.getPersons(null, null, null, 'member', memberid, null)
			.then(function (res) {
				if (res.status >= 200 && res.status < 300) {
					$scope.personsForMember = res.data.data;
					for (var i = 0; i < $scope.personsForMember.length; i++) {
						if ($scope.personsForMember[i].member._id === memberid) {
							$scope.personsForMember[i].selected = true;
							break;
						}
					}
				}
				else {
					console.log('HTTP Error: ' + res.statusText);
				}

			});
		}

		/**
		 * Defaults time
		 * @param oMember
		 * @param aDays
		 * @param oRoom
		 */
		$scope.bookDays = function (oMember, aDays, oRoom) {
			console.log('bookDays', moment().weekday());
			if (aDays.length === 1) {
				$scope.dtArriveTimeConfig = appConstants.MORNING;
				$scope.dtArrive = moment().day(aDays[0] + 7);
				$scope.dtDepartTimeConfig = appConstants.EVENING;
				$scope.dtDepart = $scope.dtArrive.clone();
			}
			else {
				switch (aDays[0]) {
					case 5:	//arriving friday, default to evening
						$scope.dtArriveTimeConfig = appConstants.EVENING;
						break;
					case 6:
						$scope.dtArriveTimeConfig = appConstants.MORNING;
						break;
					default:
						$scope.dtArriveTimeConfig = appConstants.AFTERNOON;
						break;
				}
				$scope.dtArrive = moment().day(aDays[0] + 7);
				switch (aDays[1]) {
					case 5:	//departing sat
					case 6:
						$scope.dtDepartTimeConfig = appConstants.EVENING;
						break;
					default:
						$scope.dtDepartTimeConfig = appConstants.AFTERNOON;
						break;
				}
				$scope.dtDepart = $scope.dtArrive.clone().day(aDays[1] + 7);
			}

		};

		$scope.bookRoom = function () {
			$scope.booking = {};
			if ($scope.bookingMode === 'change') {
				$scope.booking._id = $scope.initialData.booking._id;
			}
			$scope.booking.member = $scope.bookMember._id;
			$scope.booking.room = $scope.selectedRoom._id;
			$scope.booking.arrive = $scope.dtArrive;
			$scope.booking.depart = $scope.dtDepart;
			$scope.booking.note = $scope.note;
			$scope.booking.who = [];
			$scope.booking.whoCount = 0;
			$scope.booking.guestCount = $scope.guestCount;
			$scope.booking.roomRequestCount = $scope.roomRequestCount;
			for (var i = 0; i < $scope.personsForMember.length; i++) {
				if ($scope.personsForMember[i].selected) {
					$scope.booking.who.push($scope.personsForMember[i]._id);
					$scope.booking.whoCount++;
				}
			}
			bookingData.bookRoom($scope.bookingMode, $scope.booking)
			.then(function (res) {
				if (res.status >= 200 && res.status < 300) {
					$state.go('booking-schedule');
				}
				else {
					console.log('HTTP Error: ' + res.statusText);
				}
			});
		};

		$scope.onSelectArriveDate = function () {
			$scope.dtDepartMin = $scope.dtArrive;
			$scope.arriveDetail = false;
			$scope.departDetail = true;
		};

		$scope.onSelectDepartDate = function () {
			$scope.departDetail = false;
			$scope.whoDetail = true;
		};

		$scope.onSuccessAddPerson = function (person) {
			getPersonsForMember($scope.bookMember._id);
			$scope.addingPerson = false;
		};

		//$scope.popoverTemplate = '';

		$scope.showBookingDetail = function (residence, resMember) {
			console.log(resMember.bookingid);
			var booking;
			if (resMember.bookingid && resMember.bookingid.length > 0) {
				$scope.bookingSelected = null;
				for (var i = 0; i < $scope.bookings.length; i++) {
					booking = $scope.bookings[i];
					if (booking._id === resMember.bookingid) {
						$scope.bookingSelected = booking;
						break;
					}
				}
				$scope.bookingDetailShow = ($scope.bookingSelected);
			}
			else {
				$state.go('book', {data: {mode: 'new', memberid: resMember.member._id, arrive: residence.dt}});
			}

		};

		$scope.bookingDetailClose = function (sMode, oBooking) {
			console.log('mode:', sMode);
			$scope.bookingDetailShow = false;
			switch (sMode) {
				case 'new':
					newBooking(oBooking);
					break;
				case 'delete':
					deleteBooking(oBooking);
					break;
				case 'change':
					changeBooking(oBooking);
					break;
			}
		};

		function deleteBooking(oBooking) {
			bookingData.deleteBooking(oBooking._id)
			.then(function (res) {
				if (res.status >= 200 && res.status < 300) {
					getResidenceSchedule(null, {from: moment().subtract(1, 'days').toISOString()});
				}
				else {
					console.log('HTTP Error: ' + res.statusText);
				}

			});
		}

		function changeBooking(oBooking) {
			$state.go('book', {data: {mode: 'change', booking: oBooking}});
		}


		function newBooking(oBooking) {
			$state.go('book', {data: {mode: 'new', memberid: oBooking.member._id}});
		}

		function getWeekday(dayNum) {
			var a = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			return a[dayNum];
		}

		function getDaySection(dt) {
			var sReturn = 'evening';
			var hour = dt.hour();
			if (hour <= appConstants.MORNING.hour) {
				sReturn = 'morning';
			}
			else if (hour <= appConstants.AFTERNOON.hour) {
				sReturn = 'afternoon';
			}
			return sReturn;
		}

		initModule();

	}])
.directive('rnStepper', function () {
	return {
		restrict: 'AE',
		require: 'ngModel',
		scope: {
			min: '=',
			max: '=',
			ngModel: '=',
			ngDisabled: '='
		},
		template: '<button type="button" ng-disabled="isOverMin() || ngDisabled" ng-click="decrement()">-</button>' +
		'<input type="text" ng-model="ngModel" ng-disabled="ngDisabled">' +
		'<button type="button" ng-disabled="isOverMax() || ngDisabled" ng-click="increment()">+</button>',
		link: function (scope, iElement, iAttrs, ngModelController) {

			scope.label = '';

			if (angular.isDefined(iAttrs.label)) {
				iAttrs.$observe('label', function (value) {
					scope.label = ' ' + value;
					ngModelController.$render();
				});
			}

			ngModelController.$render = function () {
				// update the validation status
				checkValidity();
			};

			// when model change, cast to integer
			ngModelController.$formatters.push(function (value) {
				return parseInt(value, 10);
			});

			// when view change, cast to integer
			ngModelController.$parsers.push(function (value) {
				return parseInt(value, 10);
			});

			function checkValidity() {
				// check if min/max defined to check validity
				var valid = !(scope.isOverMin(true) || scope.isOverMax(true));
				// set our model validity
				// the outOfBounds is an arbitrary key for the error.
				// will be used to generate the CSS class names for the errors
				ngModelController.$setValidity('outOfBounds', valid);
			}

			function updateModel(offset) {
				// update the model, call $parsers pipeline...
				ngModelController.$setViewValue(ngModelController.$viewValue + offset);
				// update the local view
				ngModelController.$render();
			}

			scope.isOverMin = function (strict) {
				var offset = strict ? 0 : 1;
				return (angular.isDefined(scope.min) && (ngModelController.$viewValue - offset) < parseInt(scope.min, 10));
			};
			scope.isOverMax = function (strict) {
				var offset = strict ? 0 : 1;
				return (angular.isDefined(scope.max) && (ngModelController.$viewValue + offset) > parseInt(scope.max, 10));
			};


			// update the value when user clicks the buttons
			scope.increment = function () {
				updateModel(+1);
			};
			scope.decrement = function () {
				updateModel(-1);
			};

			// check validity on start, in case we're directly out of bounds
			checkValidity();

			// watch out min/max and recheck validity when they change
			scope.$watch('min+max', function () {
				checkValidity();
			});
		}
	};
});
