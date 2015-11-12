angular
  .module('rsl', [
    'ui.router',
    'ui.bootstrap'
  ])
  .config(function ($stateProvider, $urlRouterProvider,$httpProvider,$sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self'                                                   // Allow same origin resource loads.
    ]);

    $urlRouterProvider.otherwise('/log-in');
    $stateProvider
      .state('log-in', {
        url: '/log-in',
        templateUrl: '/views/log-in.html'
      })
      .state('persons', {
        url: '/persons',
        templateUrl: '/views/persons.html',
        controller: 'PersonCtrl'
      })
      .state('person-list', {
        url: '/person-list',
        templateUrl: '/views/person-list.html',
        controller: 'PersonCtrl'
      })
      .state('name-search', {
        url: '/name-search',
        templateUrl: '/views/name-search.html',
        controller: 'NameSearchCtrl'
      })
      .state('field-filter', {
        url: '/field-filter',
        templateUrl: '/views/field-filter.html',
        controller: 'FieldFilterCtrl'
      })
      .state('book', {
        url: '/book',
        templateUrl: '/views/book.html',
        controller: 'BookingCtrl'
      })
      .state('booking-schedule', {
        url: '/booking-schedule',
        templateUrl: '/views/booking-schedule.html',
        controller: 'BookingCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: '/views/settings.html',
        controller: 'BookingCtrl'
      })
  })
  .run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$state = $state;



  }])
  .directive('onEnterKey', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.onEnterKey);
          });

          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }
      });
    };
  })
  .directive('focusMe', function() {
    return {
      link: function(scope, element, attrs) {
        scope.$watch(attrs.focusMe, function(value) {
          if(value === true) {
            console.log('value=',value);
            element[0].focus();
            scope[attrs.focusMe] = false;
          }
        });
      }
    };
  });