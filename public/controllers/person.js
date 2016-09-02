angular.module('rsl')
  .controller('personCtrl', ['$rootScope', '$scope', '$state', 'appConstants', 'PersonData',
    function($rootScope, $scope, $state, appConstants, PersonData) {
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
        PersonData.getPersons($scope.pageNum,parseInt($scope.pageLen), null, null,null, false)
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


      /****   Settings view ****/
      $scope.vm.newPassword = '';
      $scope.setPassword = function () {
        PersonData.setPassword($scope.vm.username, $scope.vm.password, $scope.vm.newPassword)
            .then(function (res) {
              if (res.data.data.status !== 'success') {
                $rootScope.$emit('system-message',
                    {source: 'main.js', level: 'success', message: 'Password Set'});
              }
              else {
                $rootScope.$emit('system-message',
                    {source: 'main.js', level: 'fail', message: 'Password set FAILED'});
              }
            });
      };

      initModule();

}]);
