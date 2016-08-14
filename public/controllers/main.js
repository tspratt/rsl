angular.module('rsl')
  .controller('MainCtrl', ['$rootScope','$scope', '$state', '$localStorage', 'appData', 'alertService', 'PersonData',
    function ($rootScope, $scope, $state, $localStorage, appData, alertService, PersonData) {
      $scope.vm = this;
      $scope.activeState = 'sign-in';
      $scope.isLoggedIn = false;
      $scope.vm.username = '';    //'Tracy';
      $scope.vm.password = '';    //'gabboob';
      $scope.vm.rememberMe = true;
      $scope.storage = $localStorage;
      $scope.isFormValid = false;
      $scope.showLogo = true;
      $scope.loggedInUser = {};
      $scope.showSystemMessage = false;
      $scope.systemMessage = '';

      $scope.$watch('vm.rememberMe', function (newValue) {
        $scope.storage.rememberMe = $scope.vm.rememberMe;
        if ($scope.vm.rememberMe === false) {
          $scope.storage.username = '';
          $scope.storage.password = '';
        }
      });

      $scope.validateForm = function(){
        $scope.isFormValid = ($scope.vm.password.length > 0 || $scope.vm.password.length > 0)
      };

      $scope.$watch('isLoggedIn', function(){
        $rootScope.isLoggedIn = $scope.isLoggedIn;
        if ($scope.isLoggedIn === false) {
          $scope.goView('log-in');
        }
      });

      $scope.logIn = function (sState) {
        $scope.addAlert('success', '...working');
        if ($scope.vm.password === 'demo') {
          $scope.isLoggedIn = true;
          if (sState === 'book') {
            $scope.addAlert('warning', 'Demo users cannot book, showing schedule');
            sState = 'booking-schedule';
          }
          $scope.goView(sState, null);
        }
        else {
          if ($scope.vm.rememberMe) {
            $scope.storage.username = $scope.vm.username;
            $scope.storage.password = $scope.vm.password;
          }
          PersonData.loginUser($scope.vm.username, $scope.vm.password)
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

      $rootScope.$on('system-message',
        function(event, data){
          $scope.systemMessage = data.message;
          $scope.showSystemMessage = true;
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

      /****  Initilaize **/
      $scope.vm.rememberMe = $scope.storage.rememberMe;
      if ($scope.vm.rememberMe) {
        $scope.vm.username = $scope.storage.username;
        $scope.vm.password = $scope.storage.password;
      }

      $scope.validateForm();

    }])
    .directive('menuNav', function () {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          element.bind('click', function() {
            var iDirection = parseInt(attrs.menuNav);
            var elemMenu = angular.element('#menu-scroller')[0];
            if (iDirection === -1) {
              elemMenu.scrollLeft -= 50;
            }
            else {
              elemMenu.scrollLeft += 50;
            }
          });
        }
      }

    } );
