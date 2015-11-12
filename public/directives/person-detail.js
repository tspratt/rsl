/**
 * Created by Tracy on 11/11/2015.
 */
'use strict';
angular.module('rsl')
  .directive('personDetail', function () {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'partials/person-detail-tmpl.html',
      link: function (scope, element, attrs) {

      }
    };
  });