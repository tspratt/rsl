angular.module('rsl')
  .controller('bookingCtrl', ['$scope', '$state', 'appConstants', 'appData', 'bookingData', 'PersonData',
    function($scope, $state, appConstants, appData, bookingData, PersonData) {
      $scope.rooms = [];
			$scope.selectedRoom = null;

			$scope.dtArrive;
			$scope.dtDepart;
			$scope.dtArriveTimeConfig;
			$scope.dtDepartTimeConfig;
			$scope.appConstants = appConstants;
			$scope.arriveDaySection = '';
			$scope.departDaySection = '';
			$scope.dtArriveLabel = '';
			$scope.dtDepartLabel = '';
			$scope.arriveDetail = false;	//controls visibility of detail section
			$scope.departDetail = false;
			$scope.whoDetail = false;

			$scope.bookMember = appData.loggedInUser.person.member;

      function initModule(){
        //getBookings();
        getRooms();
      }

			$scope.$watch('dtArrive', function (newValue) {
				if (newValue) {
					$scope.dtArrive.set($scope.dtArriveTimeConfig);
					$scope.dtArriveLabel = getWeekday($scope.dtArrive.getDay()) + ' ' + getDaySection($scope.dtArrive) + ', ' + $scope.dtArrive.toString('M/d');
				}
			});

			$scope.$watch('dtDepart', function (newValue) {
				if (newValue) {
					$scope.dtArrive.set($scope.dtDepartTimeConfig);
					$scope.dtDepartLabel = getWeekday($scope.dtDepart.getDay()) + ' ' + getDaySection($scope.dtArrive) + ', ' + $scope.dtDepart.toString('M/d');
				}
			});
      function getBookings () {
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

      function getRooms () {
        bookingData.getRooms(null, null, 'unit', appData.loggedInUser.person.member.branch.unit, null)
            .then(function (res) {
              if (res.status >= 200 && res.status < 300) {
                $scope.rooms = res.data.data;
								var defaultRoomId = appData.loggedInUser.person.member.defaultroom;
								if(defaultRoomId) {
									for (var i = 0; i< $scope.rooms.length; i++) {
										if ($scope.rooms[i]._id === defaultRoomId) {
											$scope.selectedRoom =  $scope.rooms[i];
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

			/**
			 * Defaults time
			 * @param oMember
			 * @param aDays
			 * @param oRoom
			 */
			$scope.bookDays = function  (oMember, aDays, oRoom) {
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

			function getWeekday(dayNum) {
				var a = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
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
