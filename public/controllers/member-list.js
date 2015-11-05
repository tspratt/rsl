angular.module('rsl')
  .controller('MemberCtrl', ['$scope', '$state', 'appConstants', 'memberData',
    function($scope, $state, appConstants, memberData) {
      $scope.members = [];
      $scope.member = {};
      $scope.selectedId = '';
      var totalCount = 100;

      //paginator code: TODO: move into directive
      $scope.pageNum = 0;
      $scope.pageLen = "10";

      function initModule(){
        getMembers();
      }

      $scope.nextPage = function (){
        console.log('nextPage');
        var iPageLen = parseInt($scope.pageLen);
        if ((iPageLen * ($scope.pageNum+1)) < totalCount){
          $scope.pageNum ++;
          getMembers();
        }

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
        var iPageLen = parseInt($scope.pageLen);
        $scope.pageNum = Math.floor(totalCount / iPageLen) - 1;
        getMembers();
      };

      $scope.onChangePageLen = function(){
        console.log('onChangePageLen');
        $scope.pageNum = 0;
        getMembers();
      };
      //END paginator code

      function getMembers () {
        $scope.member = null;
        $scope.selectedId = '';
        memberData.getMembers($scope.pageNum,parseInt($scope.pageLen),null,null, false)
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
      }


      $scope.onClickMember = function(oMember) {
        $scope.member = oMember;
        $scope.selectedId = oMember._id
      };

      initModule();

}]);
