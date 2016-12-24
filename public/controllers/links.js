/**
 * Created by Tracy on 9/19/2016.
 */
angular.module('rsl')
		.controller('linksCtrl', ['$scope', '$state','appConstants', 'appData', 'InfoData',
			function ($scope, $state, appConstants, appData, InfoData ) {
				$scope.vm = {};
				$scope.vm.addLinkDetail = false;
				$scope.vm.links = [];
				$scope.vm.label = '';
				$scope.vm.url = '';
				$scope.addLink = function () {
					if ($scope.vm.label.length > 0 && $scope.vm.url.length > 0) {

					}
					InfoData.saveLink( $scope.vm.label, $scope.vm.url)
							.then(function (statusResponse) {
								if(statusResponse.status === 'success') {
									$scope.vm.addLinkDetail = false;
									listLinks();
								}
								else {
									$rootScope.$emit('system-message',
											{source: 'links.js', level: 'error', message: 'Save Url failed: ' + statusResponse.data});
								}

							});
				};

				function listLinks () {
					InfoData.listLinks()
							.then (function (statusResponse) {
								$scope.vm.links = statusResponse.data;
							})
				}

				$scope.deleteLink = function (oLink) {
					InfoData.deleteLink( oLink._id)
							.then(function (statusResponse) {
								listLinks();
							});
				};

				function init () {
					listLinks();
				}

				init();
			}])
		.directive('newWindow', function ($location, $window) {
			return {
				link: function (scope, element, attrs) {
					element.on("click", function () {
						$window.open(attrs.newWindow);
					});
				}
			}
		});