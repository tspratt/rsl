angular.module('rsl')
  .controller('MainCtrl', ['$rootScope','$scope', '$state', 'appData', 'PersonData',
    function ($rootScope, $scope, $state, appData, PersonData) {
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

      $scope.logIn = function (sState) {
        if (this.password === 'demo') {
          $scope.isLoggedIn = true;
          $scope.goView(sState);
        }
        else {
          PersonData.loginUser(this.username, this.password)
              .then(function (res) {
                if (res.status >= 200 && res.status < 300) {
                  AppData.loggedInUser = res.data.data;
                  $scope.isLoggedIn = true;
                }
                else {
                  console.log('HTTP Error: ' + res.statusText);
                  $scope.isLoggedIn = false;
                }
              })
        }
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
