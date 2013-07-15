(function () {
  'use strict';

  var using = [
    'svgAbstraction.controllers',
    'svgAbstraction.directives',
    'svgAbstraction.services',
    'ui.bootstrap'
  ];

  angular.module('svgAbstraction', using)
    .config(function ($routeProvider) {
      $routeProvider.when('/svgAbstraction', {
        templateUrl:'modules/svgAbstraction/svgAbstraction.html',
        controller:'svgAbstractionCtrl'
      });
    });

  angular.module('svgAbstraction.services',[]);
  angular.module('svgAbstraction.directives', []);
}());