/**
 * Created by Tracy on 11/11/2015.
 */
'use strict';
angular.module('rsl')
		.directive('addPerson', function () {
			var ctrl = ['$scope', 'appConstants', 'PersonData',
				function($scope, appConstants, personData) {
					$scope.person;
					$scope.appConstants = appConstants;
					function init () {

						$scope.person = {
							member: $scope.memberid,
							memberrelationship: appConstants.CHILD,
							firstname: '',
							lastname: '',
							address: '',
							phone: '',
							email: ''
						}
					}

					init();

					$scope.savePerson = function () {
						personData.savePerson($scope.person)
								.then(function (res) {
									if (res.status >= 200 && res.status < 300) {

									}
									else {
										console.log('HTTP Error: ' + res.statusText);
									}
								});
					}

				}];
			return {
				restrict    : 'E',
				scope       : {memberid: '='},
				templateUrl : 'partials/add-person-tmpl.html',
				controller	: ctrl

			};
		});