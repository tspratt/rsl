angular.module('rsl')
		.controller('personCtrl', ['$rootScope', '$scope', '$state', '$timeout', 'appConstants', 'appData', 'PersonData',
			function ($rootScope, $scope, $state, $timeout, appConstants, appData, PersonData) {
				$scope.vm = {};
				$scope.vm.matchString = '';
				$scope.vm.auth = appData.auth;
				$scope.vm.permsMaster = appData.permsMaster;
				$scope.vm.perms = [];
				$scope.vm.permissions = appData.loggedInUser.person.permissions;
				$scope.vm.action = appData.allow;
				$scope.vm.members = [];
				$scope.vm.memberrelationships = ['self','partner','child','friend'];
				$scope.persons = [];
				$scope.person = {};
				$scope.selectedId = '';
				$scope.loggedInPersonId = appData.loggedInUser.person.member._id;
				var totalCount = 100;

				$scope.shareToPercent = function (share) {
					return Math.round(share * 1000000) / 10000;
				};

				function initModule() {
					getPersons();
				}

				$scope.$watch(
						function () {
							return appData.permsMaster;
						},
						function (newValue) {
							if (newValue) {
								$scope.vm.permsMaster = newValue;
								var aPermsUser = $scope.vm.permissions;
								var aPerms = $scope.vm.permsMaster.filter(function (oPerm) {
									return (aPermsUser.filter(function(sPermName){return (oPerm.name === sPermName)}).length > 0);
								});
								$scope.vm.perms = aPerms;
							}
						}
				);

				$scope.$watch(
						function () {
							return appData.auth;
						},
						function (newValue) {
							if (newValue) {
								$scope.vm.auth = newValue;
								$scope.vm.action = $scope.vm.auth.action;
							}
						}
				);

				$scope.$watch(
						function () {
							return appData.members;
						},
						function (newValue) {
							if (newValue) {
								$scope.vm.members = newValue;
							}
						}
				);

				$scope.$watch('vm.matchString', function (newValue, oldValue) {
					if (newValue.toLowerCase() !== oldValue.toLowerCase()) {
						buildDisplayList();
					}
				});

				$scope.clearMatchString = function () {
					$scope.vm.matchString = '';
				};

				$scope.newPerson = function () {
					var person = new Person();
					$scope.persons.unshift(person);
					buildDisplayList();
					$timeout(function () {
						person.open = true;
					}, 100);
				};

				function buildDisplayList() {
					$scope.personsDisplay = $scope.persons;
					$scope.personsDisplay = $scope.personsDisplay.filter(function (person) {
						return ((person.firstname + person.lastname).toLowerCase().indexOf($scope.vm.matchString.toLowerCase()) > -1);
					});
					// $scope.vm.isFilterEmpty = ($scope.personsDisplay.length === 0);
				}

				function getPersons() {
					$scope.person = null;
					$scope.selectedId = '';
					PersonData.getPersons($scope.pageNum, parseInt($scope.pageLen), null, null, null, false)
							.then(function (res) {
								if (res.status >= 200 && res.status < 300) {
									$scope.persons = res.data.data;
									buildDisplayList();
								}
								else {
									console.log('HTTP Error: ' + res.statusText);
								}

							});
				}

				$scope.deletePerson = function (person) {
					PersonData.deletePerson(person._id)
							.then(function (res) {
								if (res.status >= 200 && res.status < 300) {
									getPersons();
								}
								else {
									console.log('HTTP Error: ' + res.statusText);
								}

							});
				};

				$scope.updatePerson = function (person) {
					PersonData.savePerson(person)
							.then(function (res) {
								if (res.status >= 200 && res.status < 300) {
									getPersons();
								}
								else {
									console.log('HTTP Error: ' + res.statusText);
								}

							});
				};

				function Person() {
					return {
						"member": appData.loggedInUser.person.member,
						"memberrelationship": "friend",
						"firstname": "New User",
						"lastname": "",
						"address": "",
						"phone": "",
						"email": "",
						"role": "user",
						"permissions": [
							"view_persons",
							"view_bookings",
							"view_schedule",
							"view_book"
						]
					}
				}


				/****   Settings view ****/
				$scope.vm.newPassword = '';
				$scope.setPassword = function () {
					PersonData.setPassword($scope.vm.username, $scope.vm.password, $scope.vm.newPassword)
							.then(function (res) {
								if (res.data.data.status !== 'success') {
									$rootScope.$emit('system-message',
											{source: 'main.js', level: 'success', message: 'Password Set'});
								}
								else {
									$rootScope.$emit('system-message',
											{source: 'main.js', level: 'fail', message: 'Password set FAILED'});
								}
							});
				};

				initModule();

			}]);
