angular.module('rsl')
  .controller('MainCtrl', ['$rootScope','$scope', '$state', 'PersonData',
    function ($rootScope, $scope, $state, PersonData) {
      $scope.activeState = 'sign-in';
      $scope.isLoggedIn = false;
      $scope.username = 'demo';
      $scope.password = 'demo';
      $scope.isFormValid = false;
      $scope.showLogo = true;

      $scope.validateForm = function(){
        $scope.isFormValid = ($scope.password.length > 0 || this.password.length > 0)
      };

      $scope.$watch('isLoggedIn', function(){
        if ($scope.isLoggedIn) {
          $scope.goView('person-list');
        }
        else {
          $scope.goView('log-in');
        }
      });

      $scope.logIn = function (sState){
        $scope.isLoggedIn = (this.password === 'demo' );
        $scope.goView(sState);
      };

      $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          var sState = toState.name;
          $scope.activeState = sState;
        });
      $scope.goView = function (state) {
        $state.go(state)
      };

      $scope.validateForm();

    }]);
