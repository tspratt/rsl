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
      $scope.vm.permsMaster = [];

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
        if ($scope.vm.password === 'demo') {
          $scope.isLoggedIn = true;
          if (sState === 'book') {
            $rootScope.$emit('system-message',
                {source: 'main.js', level: 'warning', message: 'Demo users cannot book, showing schedule'});
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
                if (res.status >= 200 && res.status < 300) {
                  if (res.data.status === 'success') {
                    appData.loggedInUser = res.data.data;
                    getPermissions();
                    $scope.isLoggedIn = true;
                    $scope.loggedInUser = appData.loggedInUser;
                    if (sState === 'book' && appData.loggedInUser.person.memberrelationship !== 'self') {
                      $rootScope.$emit('system-message',
                          {source: 'main.js', level: 'warning', message: 'Only members can book, showing schedule'});
                      sState = 'booking-schedule'
                    }
                    $scope.goView(sState, {booking: null});
                  }
                  else {
                    $rootScope.$emit('system-message',
                        {source: 'main.js', level: 'critical', message: 'Login Failed: ' + res.data.data.message});
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

      function getRoles () {
        PersonData.getRoles()
            .then (function (aRoles) {
              $scope.roles = aRoles;
            });
      }

      function getPermissions () {
        PersonData.getPermissions()
            .then (function (res) {
              if (res.status === 200) {
                $scope.permissions = res.data.data;
                buildPerms();
              }
            });
      }

      function buildPerms() {
        var oPerms = {can: {}, nested: []};
        var aPermsMaster = $scope.permissions;
        var aPermsUser = appData.loggedInUser.person.permissions;
        var oPermTmp;
        var sAction ='';
        var sName = '';
        var elementCur;
        var iLen;
        for (var i = 0; i < aPermsMaster.length; i++) {
          oPermTmp = aPermsMaster[i];
          oPerms.can[oPermTmp.name] = false;
          if (oPermTmp.action !== sAction) {
            sAction = oPermTmp.action;
            iLen = oPerms.nested.push(oPermTmp);
            elementCur = oPerms.nested[iLen - 1];
            elementCur.contexts = [];
          }
          else {
            elementCur.contexts.push(oPermTmp);
          }
        }
        for (i = 0; i < aPermsUser.length; i++) {
          sName = aPermsUser[i];
          oPerms.can[sName] = true;
        }
        appData.loggedInUser.perms = oPerms;
      }
      
      /****  Initilaize **/
      getRoles();
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
