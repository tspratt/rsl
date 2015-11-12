angular.module('rsl')
  .controller('FieldFilterCtrl', ['$scope', '$state', 'appConstants', 'PersonData',
    function($scope, $state, appConstants, PersonData) {
      $scope.members = [];
      $scope.member = null;
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
        $scope.member = null;
        $scope.selectedId = '';
        PersonData.getMembers(0,0,$scope.filterField, $scope.filterValue, false)
          .then(function (res) {
            if (res.status >= 200 && res.status < 300) {
              $scope.members = res.data.data;
              if ($scope.members.length === 1) {
                $scope.member = $scope.members[0];
              }
            }
            else {
              console.log('HTTP Error: ' + res.statusText);
            }

          });
      };

      $scope.onClickMember = function(oMember) {
        $scope.member = oMember;
        $scope.selectedId = oMember._id
      };



      initModule();

}]);
