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
		$scope.isoToday = moment().toISOString().substr(0,10);
		$scope.dtArrive = null;
		$scope.dtDepart = null;
		$scope.booking.who = [];
		$scope.guestCount = 0;
		$scope.guestRoomRequestCount = 0;
		$scope.note = '';

		$scope.dtArriveMin = null;
		$scope.dtDepartMin = null;
		$scope.departDisabled = true;
		$scope.dtArriveTimeConfig = appConstants.AFTERNOON;
		$scope.dtDepartTimeConfig = appConstants.EVENING;
		$scope.dtmSchedStart = moment().subtract(20, 'days');
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
		$scope.bookingSelected.guestRoomConfirm = null;
		$scope.bookingDetailShow = false;
		$scope.guestBookingShow = false;
		$scope.bookingMode = 'new';
		$scope.initialData;
		$scope.activestate = $state.$current.name;

		function initModule() {
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
						$scope.whoCount = $scope.booking.whoCount;
						$scope.bookMember = $scope.initialData.booking.member;
						$scope.dtArrive = moment($scope.initialData.booking.arrive);
						$scope.dtDepart = moment($scope.initialData.booking.depart);
						$scope.note = $scope.initialData.booking.note;
						$scope.bookMemberId = $scope.initialData.booking.member._id;			//there will always be a memberid if we are launched from the booking schedule
						$scope.guestCount = $scope.initialData.booking.guestCount;
						$scope.guestRoomRequestCount = $scope.initialData.booking.guestRoomRequestCount;
					}
				}
				else {
					$scope.bookMember = appData.loggedInUser.person.member;
					$scope.bookMemberId = appData.loggedInUser.person.member._id;
				}
			}
			else if ($state.$current.name === 'booking-schedule') {
				getResidenceSchedule(null, {from: $scope.dtmSchedStart.toISOString()});
			}

			if ($scope.members.length === 0) {
				getMembers();
			}
			if ($scope.bookings.length === 0) {
				getBookings();    //necessary for lookups
			}
		}

		$scope.$watch('bookMember', function (member, prevMember) {
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
				$scope.dtArriveLabel = $scope.getDateTimeLabel($scope.dtArrive);
				if ($scope.dtDepart) {
					if (!$scope.dtDepart._isAMomentObject) {
						$scope.dtDepart = moment($scope.dtDepart);
					}
					if ($scope.dtDepart.isBefore($scope.dtArrive)) {
						$scope.dtDepart = null;
					}
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
				$scope.dtDepartLabel = $scope.getDateTimeLabel($scope.dtDepart);
				checkBooking();
			}
			else {
				$scope.dtDepartLabel = '';
				$scope.bookingIncomplete = true;
			}
		});

		$scope.$watch('personsForMember', function (newValue) {
			$scope.booking.who = [];
			for (var i = 0; i < $scope.personsForMember.length; i++) {
				if ($scope.personsForMember[i].selected) {
					$scope.booking.who.push($scope.personsForMember[i]);
				}
			}
			$scope.whoCount = $scope.personsForMember.length;
			// checkBooking();
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

		$scope.getDateTimeLabel = function (momentDt) {
			if (momentDt) {
				if (!momentDt._isAMomentObject) {
					momentDt = moment(momentDt);
				}
				return momentDt.format('dddd') + ' ' + getDaySection(momentDt) + ', ' + momentDt.format('M/D');
			}
		};

		$scope.isToday = function (dt) {
			return (dt.substr(0,10) === $scope.isoToday);
		};

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
				bookingData.checkBookingOverlap($scope.selectedRoom._id, $scope.dtArrive, $scope.dtDepart)
				.then(function (res) {
					if (res.status >= 200 && res.status < 300) {
						if (res.data.data.hasOwnProperty('_id')) {
							$rootScope.$emit('system-message', {
								source: 'booking.js',
								level: 'critical',
								message: 'Selected dates overlap, please change or edit existing booking'
							});
							$scope.bookingIncomplete = true;
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
		function getBookings(oQuerySpec, oDateSpec, oSortSpec, oFieldSpec) {
			$scope.selectedId = '';
			bookingData.getBookings(oQuerySpec, oDateSpec, '{"arrive": -1}', oFieldSpec)
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
					$scope.residenceSchedule = res.data;
				}
				else {
					console.log('HTTP Error: ' + res.statusText);
				}

			});
		}

		function getRooms() {
			bookingData.getRooms(null, null, 'unit', null, null)
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
					getRooms();
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
			if ($scope.bookingMode === 'new') {
				$scope.booking = {};
			}
			$scope.booking.member = $scope.bookMember._id;
			$scope.booking.room = $scope.selectedRoom._id;
			$scope.booking.arrive = $scope.dtArrive;
			$scope.booking.depart = $scope.dtDepart;
			$scope.booking.note = $scope.note;
			$scope.booking.who = [];
			$scope.booking.whoCount = 0;
			$scope.booking.guestCount = $scope.guestCount;
			$scope.booking.guestRoomRequestCount = $scope.guestRoomRequestCount;
			for (var i = 0; i < $scope.personsForMember.length; i++) {
				if ($scope.personsForMember[i].selected) {
					$scope.booking.who.push($scope.personsForMember[i]._id);
					$scope.booking.whoCount++;
				}
			}

			$scope.bookingIncomplete = true;     //to turn off blinking button
			bookingData.bookRoom($scope.bookingMode, $scope.booking)
			.then(function (res) {
				if (res.status >= 200 && res.status < 300) {
					getBookings();
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

		$scope.showGuestBooking = function (residence, resMember) {

			$scope.guestBookingShow = ($scope.bookingSelected);

		};

		$scope.confirmGuestBooking = function (oBooking) {
			$scope.bookingDetailShow = false;
			var oGuestBooking = {};


			oGuestBooking.room = oBooking.guestRoomConfirm._id;
			for (var i = 0; i < $scope.members.length; i++) {
				var oMember = $scope.members[i];
				if (oMember.defaultroom === oBooking.guestRoomConfirm._id) {
					oGuestBooking.member = oMember._id;
				}
			}
			oGuestBooking.arrive = oBooking.arrive;
			oGuestBooking.depart = oBooking.depart;
			oGuestBooking.note = 'Guest room request confirmed by: ' + appData.loggedInUser.person.member.llcname;
			oGuestBooking.who = [];
			oGuestBooking.whoCount = oBooking.guestCount;
			oGuestBooking.guestCount = 0;
			oGuestBooking.guestRoomRequestCount = 0;

			bookingData.bookRoom('new', oGuestBooking)
					.then(function (res) {
						if (res.status >= 200 && res.status < 300) {
							getBookings();
							getResidenceSchedule(null, {from: $scope.dtmSchedStart.toISOString()});
						}
						else {
							console.log('HTTP Error: ' + res.statusText);
						}
					});
		};

		$scope.bookingDetailClose = function (sMode, oBooking) {
			$scope.bookingDetailShow = false;
			switch (sMode) {
				case 'new':
					newBooking(oBooking);
					break;
				case 'delete':
					$scope.deleteBooking(oBooking);
					break;
				case 'change':
					changeBooking(oBooking);
					break;
			}
		};

		$scope.deleteBooking = function (oBooking) {
			$scope.bookings = [];
			bookingData.deleteBooking(oBooking._id)
			.then(function (res) {
				if (res.status >= 200 && res.status < 300) {
					getBookings();
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

	}]);
