/**
 * Created by Tracy on 11/11/2015.
 */
'use strict';
angular.module('rsl')
  .directive('memberDetail', function () {
    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'partials/member-detail-tmpl.html',
      link: function (scope, element, attrs) {

      }
    };
  });