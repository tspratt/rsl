/**
 * Created by Tracy on 9/19/2016.
 */
angular.module('rsl')
		.controller('chatCtrl', ['$rootScope', '$scope', '$state', 'appConstants', 'appData', 'ChatSocket',
			function ($rootScope, $scope, $state, appConstants, appData, ChatSocket) {
				$scope.vm = {};
				$scope.vm.chatMsg = '';
				$scope.chatMessages = [];
				$scope.today = new Date();
				$scope.$on('socket:message', function(event, oData) {
					console.log('got a message', event.name);
					$scope.$apply(function() {
						var msgType = oData.msgType;
						switch (msgType) {
							case 'connected':
								sendInfo();
								getChatMessages();
								break;
						}
					});
				});

				$scope.$on('socket:chat-msg', function(event, oData) {
					console.log('got a message', event.name);
					$scope.$apply(function() {
						$scope.chatMessages.push(oData.msg)
					});
				});

				$scope.$on('socket:cmd-result', function(event, oData) {
					console.log('got a message', event.name);
					$scope.$apply(function() {
						var cmdType = oData.cmdType;
						switch (cmdType) {
							case 'get':
								switch (oData.cmd) {
									case 'message-list':
										console.log(oData.cmd, oData.result);
										$scope.chatMessages = oData.resul;
										break;
								}
								break;
						}
					});
				});


				$scope.sendChatMessage = function () {
					console.log('semding ', $scope.vm.chatMsg);
					ChatSocket.emit('message', {msgType: 'chat', msg: $scope.vm.chatMsg, socketId:ChatSocket.id});
				}
				function sendInfo () {
					console.log('sending Info');
					ChatSocket.emit('message', {msgType: 'info', user: appData.loggedInUser.person });
				}
				function getChatMessages () {
					console.log('requesting message list');
					ChatSocket.emit('command', {cmdType: 'get', cmd: 'message-list', socketId:ChatSocket.id});
				}

				$scope.$on("$locationChangeStart", function(event, next, current) {
					if (next.indexOf('chat') === -1) {
						ChatSocket.emit('command', {cmdType: 'status', cmd: 'inactive', socketId:ChatSocket.id});
					}
				});

			}]);