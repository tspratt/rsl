angular.module('rsl')
  .controller('personCtrl', ['$scope', '$state', 'appConstants', 'PersonData',
    function($scope, $state, appConstants, PersonData) {
      $scope.persons = [];
      $scope.person = {};
      $scope.selectedId = '';
      $scope.loggedInPersonId = '563c1e35ef69c27818dd916d';
      var totalCount = 100;

      $scope.shareToPercent = function(share) {
        return Math.round(share * 1000000)/10000;
      };

      function initModule(){
        getPersons();
      }


      function getPersons () {
        $scope.person = null;
        $scope.selectedId = '';
        PersonData.getPersons($scope.pageNum,parseInt($scope.pageLen),null,null, false)
          .then(function (res) {
            if (res.status >= 200 && res.status < 300) {
              $scope.persons = res.data.data;
            }
            else {
              console.log('HTTP Error: ' + res.statusText);
            }

          });
      }

      //$scope.onClickPerson = function(oPerson, index) {
      //  $scope.person = oPerson;
      //  $scope.selectedId = oPerson._id
      //};

      initModule();

}]);
