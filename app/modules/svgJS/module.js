(function () {
  'use strict';
  angular.module('svgJS', ['svgJS.controllers', 'svgJS.directives'])
    .config(function ($routeProvider) {
      $routeProvider.when('/svgJS', {
        templateUrl:'modules/svgJS/views/main.html',
        controller:'svgJSCtrl'
      });
    })
}());
