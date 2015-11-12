angular.module('rsl')
  .controller('NameSearchCtrl', ['$scope', '$state', '$timeout', 'appConstants','PersonData',
    function($scope, $state, $timeout, appConstants, PersonData) {
      $scope.persons = [];
      $scope.person = null;
      $scope.selectedId = '';
      $scope.selectedId = '';
      $scope.matchString = '';

      function initModule(){
        document.getElementById('inputMatchString').focus();
      }


      $scope.onChangeMatchString = function () {
        $timeout(function () {
          $scope.person = null;
          $scope.selectedId = '';
          PersonData.getPersonsByNameMatch($scope.matchString)
            .then(function (res) {
              if (res.status >= 200 && res.status < 300) {
                $scope.persons = res.data.data;
                if ($scope.persons.length === 1) {
                  $scope.person = $scope.persons[0];
                }
              }
              else {
                console.log('HTTP Error: ' + res.statusText);
              }

            });

        },appConstants.QUERY_DELAY);
      };

      $scope.onClickPerson = function(oPerson) {
        $scope.person = oPerson;
        $scope.selectedId = oPerson._id
      };

     initModule();
}]);
