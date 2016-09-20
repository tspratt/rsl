/**
 * Created by Tracy on 9/19/2016.
 */
angular.module('rsl')
		.controller('chatCtrl', ['$rootScope', '$scope', '$state', 'appConstants', 'PersonData',
			function ($rootScope, $scope, $state, appConstants, PersonData) {
				var socket;
			$scope.persons = [];

				function init () {
					socket = io.connect('http://localhost:5000');
					socket.on('message', function (message) {
						console.log(message);
						socket.emit('message', 'yo');
					});
				}


				$scope.getMessages = function () {

				};

				init();
			}]);