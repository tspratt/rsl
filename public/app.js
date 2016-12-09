angular
		.module('rsl', [
			'ui.router',
			'ui.bootstrap',
			'ngStorage',
			'btford.socket-io',
			'luegg.directives',
			'angular-scroll-animate'
		])
		.config(function ($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider) {
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
						controller: 'personCtrl'
					})
					.state('person-list', {
						url: '/person-list',
						templateUrl: '/views/person-list.html',
						controller: 'personCtrl'
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
						controller: 'bookingCtrl',
						params: {data: null}
					})
					.state('booking-schedule', {
						url: '/booking-schedule',
						templateUrl: '/views/booking-schedule.html',
						controller: 'bookingCtrl'
					})
					.state('booking-list', {
						url: '/booking-list',
						templateUrl: '/views/booking-list.html',
						controller: 'bookingCtrl'
					})
					.state('chat', {
						url: '/chat',
						templateUrl: '/views/chat.html',
						controller: 'chatCtrl'
					})
					.state('settings', {
						url: '/settings',
						templateUrl: '/views/settings.html',
						controller: 'personCtrl'
					})
		})
		.run(['$rootScope', '$state', 'appData', function ($rootScope, $state, appData) {
			$rootScope.$state = $state;

			$rootScope.$on("$locationChangeStart", function (event, next, current) {
				console.log('location cur: ', current, 'next:', next);
				if ($rootScope.isLoggedIn) {
					if (next.indexOf('log-in') > -1) {
						event.preventDefault();
					}
				}
				else {
					$state.go('log-in');
				}
			});
			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
				if (toState.name !== 'log-in') {
					appData.setPreference('prevState', toState.name);
				}

			});

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
		.directive('focusMe', function () {
			return {
				link: function (scope, element, attrs) {
					scope.$watch(attrs.focusMe, function (value) {
						if (value === true) {
							console.log('value=', value);
							element[0].focus();
							scope[attrs.focusMe] = false;
						}
					});
				}
			};
		});