'use strict';
angular.module('rsl')
  .factory('ChatSocket', ['envConfig', 'socketFactory', function (envConfig, socketFactory) {
    var socket = socketFactory();
    socket.forward('message');
    socket.forward('broadcast');
    socket.forward('error');
    socket.forward('cmd-result');
    socket.forward('chat-msg');
    return socket;
  }]);
