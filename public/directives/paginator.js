angular.module('rsl')
  .directive('paginator', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'partials/paginator.html',
      controller: Paginator
    }
  });
