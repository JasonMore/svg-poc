(function () {
  'use strict';

  angular.module('realTime.services').service('socket', function() {
    var socket = io.connect();
    return socket;
  });

}());