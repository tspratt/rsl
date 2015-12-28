angular.module('rsl')
  .controller('MainCtrl', ['$rootScope','$scope', '$state', 'appData', 'alertService', 'PersonData',
    function ($rootScope, $scope, $state, appData, alertService, PersonData) {
      $scope.activeState = 'sign-in';
      $scope.isLoggedIn = false;
      $scope.username = 'Tracy';
      $scope.password = 'gabboob';
      $scope.isFormValid = false;
      $scope.showLogo = true;
      $scope.loggedInUser = {};

      $scope.validateForm = function(){
        $scope.isFormValid = ($scope.password.length > 0 || this.password.length > 0)
      };

      $scope.$watch('isLoggedIn', function(){
        $rootScope.isLoggedIn = $scope.isLoggedIn;
        if ($scope.isLoggedIn === false) {
          $scope.goView('log-in');
        }
      });

      $scope.logIn = function (sState) {
        $scope.addAlert('success', '...working');
        if (this.password === 'demo') {
          $scope.isLoggedIn = true;
          if (sState === 'book') {
            $scope.addAlert('warning', 'Demo users cannot book, showing schedule');
            sState = 'booking-schedule';
          }
          $scope.goView(sState, null);
        }
        else {
          PersonData.loginUser(this.username, this.password)
              .then(function (res) {
                $scope.closeAllAlerts();
                if (res.status >= 200 && res.status < 300) {
                  if (res.data.status === 'success') {
                    appData.loggedInUser = res.data.data;
                    $scope.isLoggedIn = true;
                    $scope.loggedInUser = appData.loggedInUser;
                    if (sState === 'book' && appData.loggedInUser.person.memberrelationship !== 'self') {
                      $scope.addAlert('warning', 'Only members can book, showing schedule');
                      sState = 'booking-schedule'
                    }
                    $scope.goView(sState, {booking: null});
                  }
                  else {
                    $scope.addAlert('danger', 'Login Failed: ' + res.data.data.message);
                  }

                }
                else {
                  console.log('HTTP Error: ' + res.statusText);
                  $scope.isLoggedIn = false;
                  alertService.add('Login Failed', '');
                }
              })
        }
      };

      $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          $scope.activeState = toState.name;
        });

      $scope.goView = function (state, oParams) {
        $state.go(state, oParams);
      };

      $scope.alerts = [];

      $scope.addAlert = function(type,msg) {
        $scope.alerts.push({type: type, msg: msg});
      };

      $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
      };
      $scope.closeAllAlerts = function() {
        $scope.alerts = [];
      };

      $scope.validateForm();

    }]);
