angular.module('rsl')
  .controller('FieldFilterCtrl', ['$scope', '$state', 'appConstants', 'PersonData',
    function($scope, $state, appConstants, PersonData) {
      $scope.persons = [];
      $scope.person = null;
      $scope.selectedId = '';
      $scope.filterField = 'state';
      $scope.filterValue = '';

      function initModule(){
        document.getElementById('inputFilterValue').focus();
      }

      $scope.onChangeField = function(){
        document.getElementById('inputFilterValue').focus();
      };

      $scope.onClickFilter = function(){
        $scope.person = null;
        $scope.selectedId = '';
        PersonData.getPersons(0,0,$scope.filterField, $scope.filterValue, false)
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
      };

      $scope.onClickPerson = function(oPerson) {
        $scope.person = oPerson;
        $scope.selectedId = oPerson._id
      };



      initModule();

}]);
