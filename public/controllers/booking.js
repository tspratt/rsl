angular.module('rsl')
  .controller('bookingCtrl', ['$scope', '$state', 'appConstants', 'appData', 'bookingData', 'PersonData',
    function($scope, $state, appConstants, appData, bookingData, PersonData) {
      $scope.rooms = [];
			$scope.selectedRoom = null;

			$scope.arriveDetail = false;	//controls visibility of detail section
			$scope.departDetail = false;
			$scope.whoDetail = false;

			$scope.bookMember = appData.loggedInUser.person.member;

      function initModule(){
        //getBookings();
        getRooms();
      }

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

			$scope.bookDays = function  (oMember, aDays, oRoom) {
				console.log('bookDays');
				if (aDays.length === 1) {
					var dtArrive = Date.parse('next ' + getWeekday(aDays[0]));
					console.log(dtArrive);
				}
				else {

				}
			};

			function getWeekday(dayNum) {
				var a = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
				return a[dayNum];
			}

      initModule();

}]);
