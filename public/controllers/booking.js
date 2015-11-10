angular.module('rsl')
  .controller('bookingCtrl', ['$scope', '$state', 'appConstants', 'bookingData', 'memberData',
    function($scope, $state, appConstants, bookingData, memberData) {

      function initModule(){
        getBookings();
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




      initModule();

}]);
