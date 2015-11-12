angular.module('rsl')
  .controller('Paginator', ['$scope', '$state', 'appConstants', 'PersonData',
    function($scope, $state, appConstants, PersonData) {
     /* $scope.pageNum = 10;
      $scope.pageLen = 10;

      $scope.nextPage = function (){
        console.log('nextPage');
        $scope.pageNum ++;
        getPersons();
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

      };

      $scope.onChangePageLen = function(){
        console.log('onChangePageLen');
        //getPersons();
      };*/

}])
  .directive('paginator', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'partials/paginator.html',
      /*controller: 'Paginator',
      scope: {
        fetchPage: '&'
      }*/
    }
  });
