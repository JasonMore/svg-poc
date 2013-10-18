(function () {
  'use strict';

  var using = [
    'svgAbstraction.controllers',
    'svgAbstraction.directives',
    'svgAbstraction.services',
    'ui.bootstrap',
    'menuAim',
    'liveResource'
//    'ngSvg'
  ];

  angular.module('svgAbstraction', using)
    .config(function ($routeProvider) {
      $routeProvider.when('/svgAbstraction/:id', {
        templateUrl:'modules/svgAbstraction/svgAbstraction.html',
        controller:'svgAbstractionCtrl',
        resolve: {
          liveResource: function (liveResourceProvider) {
            return liveResourceProvider.createLiveResource;
          }
        }
      });
    });

  angular.module('svgAbstraction.services',[]);
  angular.module('svgAbstraction.directives', []);
  angular.module('svgAbstraction.filters', []);
}());