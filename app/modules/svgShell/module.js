(function () {
  'use strict';

  var using = [
    'svgShell.controllers',
    'svgShell.directives',
    'svgShell.services',
    'ui.bootstrap'
  ];

  angular.module('svgShell', using)
    .config(function ($routeProvider) {
      $routeProvider.when('/svgShell', {
        templateUrl:'modules/svgShell/views/main.html',
        controller:'svgShellCtrl'
      });
    });

  angular.module('svgShell.services',[]);
}());
