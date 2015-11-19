angular.module('rsl')
  .controller('bookingCtrl', ['$scope', '$state', 'appConstants', 'appData', 'bookingData', 'PersonData',
    function($scope, $state, appConstants, appData, bookingData, PersonData) {
      $scope.rooms = [];
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
        bookingData.getRooms(null, null, null, {field: 'unit', value: appData.loggedInUser.person.member.branch.unit}, null)
            .then(function (res) {
              if (res.status >= 200 && res.status < 300) {
                $scope.rooms = res.data.data;
              }
              else {
                console.log('HTTP Error: ' + res.statusText);
              }

            });
      }


      initModule();

}]);
