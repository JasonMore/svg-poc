(function() {
  'use strict';
  angular.module('svgPoc', ['svgPoc.controllers', 'svgPoc.directives', 'svgPoc.services'])
    .config(function ($routeProvider) {
      $routeProvider.when('/svgPoc', {
        templateUrl:'modules/svgPoc/views/main.html',
        controller:'svgPocCtrl'
      });
    })
  ;
}());
