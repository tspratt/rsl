angular.module('rsl')
		.directive('onModelChange', function ($parse) {
					return {
						restrict: 'A',
						require: 'ngModel',
						scope: {callback: '&onModelChange'},
						link: function (scope, elem, attrs, ngModel) {
							var callback = $parse(attrs.onModelChange);
							scope.$watch(function () {
								return ngModel.$modelValue;
							}, function (newValue, oldValue) {
								if (newValue && (newValue !== oldValue)) {
									scope.callback();
								}
							});
						}
					};
				}
		);