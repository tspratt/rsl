/**
 * Created by Tracy on 11/11/2015.
 */
'use strict';
angular.module('rsl')
  .directive('personDetail', ['$timeout',function ($timeout) {
    return {
      restrict: 'E',
      scope: {
        person: '=',
        vm: '=',
        updatePerson: '&'
      },
      templateUrl: 'partials/person-detail-tmpl.html',
      link: function (scope, element, attrs) {
        scope.perms = {};

        function generatePerms () {
          var oPerms = null;
          var aPerms = angular.copy(scope.$parent.vm.perms);            //master list of available permission objects
          var aPermNames = scope.person.permissions;                  //array of permission.name strings assigned to this person
          oPerms = {can: {}, nested: []};
          var oPermTmp;
          var sAction ='';
          var sName = '';
          var oAction;
          var iLen;
          for (var i = 0; i < aPerms.length; i++) {         //build Action/context nested arrays
            oPermTmp = aPerms[i];
            oPermTmp.allow = false;
            oPerms.can[oPermTmp.name] = oPermTmp;
            if (oPermTmp.action !== sAction) {
              sAction = oPermTmp.action;
              oAction = {action:sAction, contexts:[oPermTmp]};
              oPerms.nested.push(oAction);
            }
            else {
              oAction.contexts.push(oPermTmp);
            }
          }
          for (i = 0; i < aPermNames.length; i++) {
            oPermTmp = oPerms.can[aPermNames[i]];
            if (oPermTmp) {
              oPermTmp.allow = true;
            }
          }
          scope.perms = oPerms;
        }


        scope.savePerson = function () {
          var aPermisions = [];
          for (var sPermName in scope.perms.can) {
            if (scope.perms.can.hasOwnProperty(sPermName)) {
              if (scope.perms.can[sPermName].allow) {
                aPermisions.push(sPermName);
              }
            }
          }
          scope.person.permissions = aPermisions;
          scope.updatePerson({oUpdate: scope.person});
        };

        scope.cancelUpdate = function (person) {
          person.open = false;
        };

        scope.$watch(function () {return scope.person.open}, function (newValue, oldValue) {
          if (newValue && newValue === true) {
          	$timeout(function () {scope.vm.scrollTo('a-' + scope.person._id);},200);
          }
        });

        generatePerms();
      }
    };
  }]);