/**
 * Created by Tracy on 9/19/2016.
 */
angular.module('rsl')
		.controller('chatCtrl', ['$rootScope', '$scope', '$state','$localStorage', '$document', '$timeout','appConstants', 'appData', 'ChatSocket',
			function ($rootScope, $scope, $state, $localStorage, $document, $timeout, appConstants, appData, ChatSocket) {
				$scope.storage = $localStorage;
				$scope.vm = {};
				$scope.vm.chatMsgSend = '';
				$scope.vm.matchString = '';
				$scope.chatMessages = [];
				$scope.vm.isFilterEmpty = false;
				$scope.dtLastRead = $scope.storage.dtLastRead || new Date();
				$scope.vm.dtFrom = moment().subtract('days', 30).toDate();
				$scope.vm.monthPickOpen = false;
				$scope.dateOptions = {
					minMode: "month",
					startingDay: 1,
					placement: 'bottom-right'
				};

				$scope.vm.msgFontSize = 13;
				$scope.vm.focusInput = true;

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
						$scope.chatMessages.push(oData.message);
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
										$scope.chatMessages = oData.result.map(function(item) {
											var message = item.message;
											message.read = (message.dt <= $scope.dtLastRead);
											return message;
										});
										break;
								}
								break;
						}
					});
				});

				$scope.$watch('vm.matchString', function (newValue, oldValue) {
					if (newValue.toLowerCase() !== oldValue.toLowerCase()) {
						getChatMessages();
					}
				});

				$scope.clearMatchString = function () {
					$scope.vm.matchString = '';
					getChatMessages();
				};

				$scope.toggleMonthPicker = function () {
					$scope.vm.monthPickOpen=!$scope.vm.monthPickOpen;
				};

				$scope.$watch('vm.dtFrom', function () {
					getChatMessages();
				});

				$scope.markAsRead = function ($element, scope) {
					var message = scope.$parent.message;
					$timeout(function () {message.read = true;},1000);
					$scope.storage.dtLastRead = message.dt;

				};

				$scope.sendChatMessage = function () {
					var message = {msg: $scope.vm.chatMsgSend, dt: new Date(), person: appData.loggedInUser.person};
					$scope.chatMessages.push(message);
					ChatSocket.emit('message', {msgType: 'chat', message:message, socketId:ChatSocket.id});
					$scope.vm.chatMsgSend = '';
					// $scope.vm.focusInput = true;                    //does not work
					// $document.find('#chatMsgInput').focus();     //todo: fix directive
				};

				function sendInfo () {
					console.log('sending Info');
					ChatSocket.emit('message', {msgType: 'info', user: appData.loggedInUser.person });
				}
				function getChatMessages () {
					console.log('requesting message list');
					ChatSocket.emit('command', {cmdType: 'get', cmd: 'message-list', search: $scope.vm.matchString, from: $scope.vm.dtFrom.toISOString(), socketId:ChatSocket.id});
				}

				$scope.$on("$locationChangeStart", function(event, next, current) {
					if (next.indexOf('chat') > -1) {
						getChatMessages();
					}
					else {
						ChatSocket.emit('command', {cmdType: 'status', cmd: 'inactive', socketId:ChatSocket.id});
					}
				});

			}])
		.directive('scrollToLast', function($timeout) {
			return function(scope, $element, attrs) {
				if (scope.$last){
					$timeout(function() {
						//$("body").animate({scrollTop: $target.offset().top}, "slow");
						var scrollContainer = $element[0].parentElement;
						if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.offsetHeight) {
							scrollContainer.scrollTop = scrollContainer.scrollHeight;
						}
					}, 0);
				}
			};
		});