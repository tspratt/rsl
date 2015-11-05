angular.module('rsl')
  .controller('Paginator', ['$scope', '$state', 'appConstants', 'memberData',
    function($scope, $state, appConstants, memberData) {
     /* $scope.pageNum = 10;
      $scope.pageLen = 10;

      $scope.nextPage = function (){
        console.log('nextPage');
        $scope.pageNum ++;
        getMembers();
      };
      $scope.prevPage = function (){
        console.log('prevPage');
        if ($scope.pageNum > 0) {
          $scope.pageNum --;
          getMembers();
        }
      };
      $scope.firstPage = function (){
        console.log('firstPage');
        $scope.pageNum = 0;
        getMembers();
      };
      $scope.lastPage = function (){

      };

      $scope.onChangePageLen = function(){
        console.log('onChangePageLen');
        //getMembers();
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
