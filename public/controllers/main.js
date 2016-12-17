angular.module('rsl')
  .controller('MainCtrl', ['$rootScope','$scope', '$state', '$http', 'appData', 'alertService', 'PersonData',
    function ($rootScope, $scope, $state, $http, appData, alertService, PersonData) {
      $scope.vm = this;
      $scope.activeState = 'sign-in';
      $scope.isLoggedIn = false;
      $scope.vm.username = '';    //'Tracy';
      $scope.vm.password = '';    //'gabboob';
      $scope.vm.rememberMe = true;
      $scope.isFormValid = false;
      $scope.showLogo = true;
      $scope.loggedInUser = {};
      $scope.showSystemMessage = false;
      $scope.systemMessage = '';
      $scope.vm.permsMaster = [];

      appData.loadPreferences();

      $scope.$watch('vm.rememberMe', function (newValue) {
        appData.setPreference('rememberMe', $scope.vm.rememberMe);
        if ($scope.vm.rememberMe === false) {
          appData.preferences.username = '';
          appData.preferences.password = '';
          appData.setPreference('defaultPrevState', false);
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

      $rootScope.$on('http-unauthorized', function () {
        $scope.isLoggedIn = false
      });

      $scope.logIn = function (sState) {
        $scope.isLoggedIn = true;                 //to fix up the ui immediately. if login fails, we will reset then
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
            appData.setPreference('username', $scope.vm.username);
            appData.setPreference('password', $scope.vm.password);
          }
          PersonData.loginUser($scope.vm.username, $scope.vm.password)
              .then(function (res) {
                if (res.status >= 200 && res.status < 300) {
                  if (res.data.status === 'success') {
                    appData.loggedInUser = res.data.data;
                    $http.defaults.headers.common.Authorization = appData.loggedInUser.token;
                    getRoles();
                    getMembers();
                    getPermissions();
                    getAllPersons();
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
        var forceReload = false;
        if (state === $scope.activeState) {
          forceReload = true;
          if (oParams) {
            oParams.rebuildSched = true;
          }
          else {
            oParams = {rebuildSched: true}
          }
        }
        $state.go(state, oParams, {relaod: forceReload});
      };

      function getMembers() {
        PersonData.getPersons(null, null, null, 'memberrelationship', 'self', null)
            .then(function (res) {
              if (res.status >= 200 && res.status < 300) {
                appData.members = res.data.data.map(function (person) {
                  return person.member;
                });
                for (var i = 0; i < appData.members.length; i++) {
                  if (appData.members[i]._id === $scope.bookMemberId) {
                    appData.members[i].selected = true;
                    $scope.bookMember = appData.members[i];
                    break;
                  }
                }
                //getRooms();
              }
              else {
                console.log('HTTP Error: ' + res.statusText);
              }
            });
      }


      function getAllPersons() {
        PersonData.getPersons(null, null, null, null, null, null)
            .then(function (res) {
              if (res.status >= 200 && res.status < 300) {
                appData.allPersons = res.data.data;
              }
              else {
                console.log('HTTP Error: ' + res.statusText);
              }
            });
      }

      function getRoles () {
        PersonData.getRoles()
            .then (function (res) {
              $scope.roles = res.data.data;
              appData.auth.roles = res.data.data;
            });
      }

      function getPermissions () {
        PersonData.getPermissions()
            .then (function (res) {
              if (res.status === 200) {
                appData.permsMaster = res.data.data;
                buildAuth();
              }
            });
      }

      function buildAuth() {
        var oPerms = {action: {}, nested: []};
        var aPermsUser = appData.loggedInUser.person.permissions;

        //build array of available permissions
        var aPerms = appData.permsMaster.filter(function (oPerm) {
          return (aPermsUser.filter(function(sPermName){return (oPerm.name === sPermName)}).length > 0);
        });
        var oPermTmp;
        var sAction ='';
        var sName = '';
        var oAction;
        var iLen;
        for (var i = 0; i < aPerms.length; i++) {
          oPermTmp = aPerms[i];
          oPerms.action[oPermTmp.name] = true;
          if (oPermTmp.action !== sAction) {
            sAction = oPermTmp.action;
            oAction = {action:sAction, contexts:[oPermTmp]};
            oPerms.nested.push(oAction);
          }
          else {
            oAction.contexts.push(oPermTmp);
          }
        }

        appData.auth.perms = oPerms;
      }

      /****  Initilaize **/
      $scope.vm.rememberMe = appData.preferences.rememberMe;
      if ($scope.vm.rememberMe) {
        $scope.vm.username = appData.preferences.username;
        $scope.vm.password = appData.preferences.password;
        $scope.validateForm();
      }

      if ($scope.vm.rememberMe && appData.getPreference('defaultPrevState')) {
        var sPrevState = appData.getPreference('prevState');
        if (sPrevState &&sPrevState.length > 0) {
          $scope.logIn(appData.getPreference('prevState'))
        }
      }
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
    });
