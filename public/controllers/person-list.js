angular.module('rsl')
  .controller('PersonCtrl', ['$scope', '$state', 'appConstants', 'PersonData',
    function($scope, $state, appConstants, PersonData) {
      $scope.persons = [];
      $scope.person = {};
      $scope.selectedId = '';
      var totalCount = 100;

      $scope.shareToPercent = function(share) {
        return Math.round(share * 1000000)/10000;
      };

      //paginator code: TODO: move into directive
      $scope.pageNum = 0;
      $scope.pageLen = "10";

      function initModule(){
        getPersons();
      }

      $scope.nextPage = function (){
        console.log('nextPage');
        var iPageLen = parseInt($scope.pageLen);
        if ((iPageLen * ($scope.pageNum+1)) < totalCount){
          $scope.pageNum ++;
          getPersons();
        }

      };
      $scope.prevPage = function (){
        console.log('prevPage');
        if ($scope.pageNum > 0) {
          $scope.pageNum --;
          getPersons();
        }
      };
      $scope.firstPage = function (){
        console.log('firstPage');
        $scope.pageNum = 0;
        getPersons();
      };
      $scope.lastPage = function (){
        var iPageLen = parseInt($scope.pageLen);
        $scope.pageNum = Math.floor(totalCount / iPageLen) - 1;
        getPersons();
      };

      $scope.onChangePageLen = function(){
        console.log('onChangePageLen');
        $scope.pageNum = 0;
        getPersons();
      };
      //END paginator code

      function getPersons () {
        $scope.person = null;
        $scope.selectedId = '';
        PersonData.getPersons($scope.pageNum,parseInt($scope.pageLen),null,null, false)
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
      }


      $scope.onClickPerson = function(oPerson) {
        $scope.person = oPerson;
        $scope.selectedId = oPerson._id
      };

      initModule();

}]);
