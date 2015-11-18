/**
 * Created by Tracy on 11/17/2015.
 */
angular.module('rsl')
		.factory('alertService', ['$rootScope', 'appConstants', function ($rootScope, appConstants) {
			var alertService = {};

			$rootScope.alerts = [];																	// create an array of alerts available globally

			alertService.add = function(type, msg) {
				return $rootScope.alerts.push({
					type: type,
					msg: msg,
					close: function() {
						return alertService.closeAlert(this);
					}
				});
			};

			alertService.closeAlert = function(alert) {
				return this.closeAlertIdx($rootScope.alerts.indexOf(alert));
			};

			alertService.closeAlertIdx = function(index) {
				return $rootScope.alerts.splice(index, 1);
			};

			alertService.clear = function(){
				$rootScope.alerts = [];
			};
			return alertService;
		}]);
