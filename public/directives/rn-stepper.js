/**
 * Created by Tracy on 9/25/2016.
 */
angular.module('rsl')
		.directive('rnStepper', function () {
			return {
				restrict: 'AE',
				require: 'ngModel',
				scope: {
					min: '=',
					max: '=',
					ngModel: '=',
					ngDisabled: '='
				},
				templateUrl: './directives/rn-stepper-tmpl.html',
				link: function (scope, iElement, iAttrs, ngModelController) {

					scope.label = '';

					scope.isUnderMin = function (strict) {
						var offset = strict ? 0 : 1;
						return (angular.isDefined(scope.min) && (ngModelController.$viewValue - offset) < parseInt(scope.min, 10));
					};
					scope.isOverMax = function (strict) {
						var offset = strict ? 0 : 1;
						return (angular.isDefined(scope.max) && (ngModelController.$viewValue + offset) > parseInt(scope.max, 10));
					};

					// update the value when user clicks the buttons. Since we can't eisable the <i> tage, we check min mas here
					scope.increment = function () {
						if (!scope.isOverMax(false)) {
							updateModel(+1);
						}

					};
					scope.decrement = function () {
						if (!scope.isUnderMin(false)) {
							updateModel(-1);
						}
					};

					function checkValidity() {
						// check if min/max defined to check validity
						var valid = !(scope.isUnderMin(true) || scope.isOverMax(true));
						// set our model validity
						// the outOfBounds is an arbitrary key for the error.
						// will be used to generate the CSS class names for the errors
						ngModelController.$setValidity('outOfBounds', valid);
					}

					function updateModel(offset) {
						// update the model, call $parsers pipeline...
						ngModelController.$setViewValue(ngModelController.$viewValue + offset);
						// update the local view
						ngModelController.$render();


						// watch out min/max and recheck validity when they change
					scope.$watch('min+max', function () {
						checkValidity();
					});

						ngModelController.$render = function () {
							// update the validation status
							checkValidity();
						};

					if (angular.isDefined(iAttrs.label)) {
						iAttrs.$observe('label', function (value) {
							scope.label = ' ' + value;
							ngModelController.$render();
						});
					}

					// when model change, cast to integer
					ngModelController.$formatters.push(function (value) {
						return parseInt(value, 10);
					});

					// when view change, cast to integer
					ngModelController.$parsers.push(function (value) {
						return parseInt(value, 10);
					});
}



					// check validity on start, in case we're directly out of bounds
					checkValidity();

				}
			};
		});
