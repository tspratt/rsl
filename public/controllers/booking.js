angular.module('rsl')
		.controller('bookingCtrl', ['$scope', '$state','$location', '$anchorScroll','appConstants', 'appData', 'bookingData', 'PersonData',
			function ($scope, $state, $location, $anchorScroll, appConstants, appData, bookingData, personData) {
				$scope.rooms = [];

				$scope.booking = {};
				$scope.bookMember = appData.loggedInUser.person.member;
				$scope.selectedRoom = null;
				$scope.dtArrive;
				$scope.dtDepart;
				$scope.booking.who = [];
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
				$scope.addingPerson = false;
				$scope.bookingIncomplete = true;



				function initModule() {
					//getBookings();
					getRooms();
					getPersonsForMember();
				}

				$scope.$watch('dtArrive', function (newValue) {
					if (newValue) {
						$scope.departDisabled = false;
						$scope.dtArrive.set($scope.dtArriveTimeConfig);
						$scope.dtArriveLabel = getWeekday($scope.dtArrive.getDay()) + ' ' + getDaySection($scope.dtArrive) + ', ' + $scope.dtArrive.toString('M/d');
						checkBooking();
					}
					else {
						$scope.departDisabled = true;
					}
				});

				$scope.$watch('dtDepart', function (newValue) {
					if (newValue) {
						$scope.dtArrive.set($scope.dtDepartTimeConfig);
						$scope.dtDepartLabel = getWeekday($scope.dtDepart.getDay()) + ' ' + getDaySection($scope.dtArrive) + ', ' + $scope.dtDepart.toString('M/d');
						checkBooking();
					}
				});

				$scope.$watch('personsForMember', function (newValue) {
					$scope.whoCount = 0;
					for (var i = 0; i < $scope.personsForMember.length; i++) {
						if ($scope.personsForMember[i].selected) {
							$scope.whoCount ++;
						}
					}
					checkBooking();
				},true);

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

				function collapseOthers (sExpCur) {
					for (var i = 0; i < aExpanders.length; i++) {
						var sName = aExpanders[i];
						if (sName !== sExpCur) {
							$scope[sName] = false;
						}
					}
				}

				function checkBooking() {
					$scope.bookingIncomplete = !$scope.dtArrive || !$scope.dtDepart || ($scope.whoCount === 0);
				}

				function getBookings() {
					$scope.booking = null;
					$scope.selectedId = '';
					bookingData.getBookings()
							.then(function (res) {
								if (res.status >= 200 && res.status < 300) {
									$scope.bookings = res.data.data;
									if ($scope.bookings.length === 1) {
										$scope.booking = $scope.bookings[0];
									}
								}
								else {
									console.log('HTTP Error: ' + res.statusText);
								}

							});
				}

				function getRooms() {
					bookingData.getRooms(null, null, 'unit', appData.loggedInUser.person.member.branch.unit, null)
							.then(function (res) {
								if (res.status >= 200 && res.status < 300) {
									$scope.rooms = res.data.data;
									var defaultRoomId = appData.loggedInUser.person.member.defaultroom;
									if (defaultRoomId) {
										for (var i = 0; i < $scope.rooms.length; i++) {
											if ($scope.rooms[i]._id === defaultRoomId) {
												$scope.selectedRoom = $scope.rooms[i];
												break;
											}
										}
									}

								}
								else {
									console.log('HTTP Error: ' + res.statusText);
								}

							});
				}

				function getPersonsForMember() {
					personData.getPersons(null, null, null, 'member', appData.loggedInUser.person.member._id, null)
							.then(function (res) {
								if (res.status >= 200 && res.status < 300) {
									$scope.personsForMember = res.data.data;
									for (var i = 0; i < $scope.personsForMember.length; i++) {
										if ($scope.personsForMember[i].member._id === appData.loggedInUser.person.member._id) {
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
					console.log('bookDays');

					if (aDays.length === 1) {
						$scope.dtArriveTimeConfig = appConstants.MORNING;
						$scope.dtArrive = Date.parse('next ' + getWeekday(aDays[0]));
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
						$scope.dtArrive = Date.parse('next ' + getWeekday(aDays[0]));
						switch (aDays[1]) {
							case 5:	//departing sat
							case 6:
								$scope.dtDepartTimeConfig = appConstants.EVENING;
								break;
							default:
								$scope.dtDepartTimeConfig = appConstants.AFTERNOON;
								break;
						}
						$scope.dtDepart = Date.parse('next ' + getWeekday(aDays[1]));
					}

				};

				$scope.bookRoom = function (){
					$scope.booking = {};
					$scope.booking.member = $scope.bookMember._id;
					$scope.booking.room = $scope.selectedRoom._id;
					$scope.booking.arrive = $scope.dtArrive;
					$scope.booking.depart = $scope.dtDepart;
					$scope.booking.note = $scope.note;
					$scope.booking.who = [];
					$scope.booking.whoCount = 0;
					for (var i = 0; i < $scope.personsForMember.length; i++) {
						if ($scope.personsForMember[i].selected) {
							$scope.booking.who.push($scope.personsForMember[i]._id);
							$scope.booking.whoCount ++;
						}
					}
					bookingData.bookRoom($scope.booking)
							.then(function (res) {
								if (res.status >= 200 && res.status < 300) {

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
					getPersonsForMember();
					$scope.addingPerson = false;
				};


				function getWeekday(dayNum) {
					var a = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
					return a[dayNum];
				}

				function getDaySection(dt) {
					var sReturn = 'evening';
					var hour = dt.getHours();
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
