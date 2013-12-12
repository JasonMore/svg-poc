(function () {
  'use strict';

  var using = [
    'svgAbstraction.controllers',
    'svgAbstraction.directives',
    'svgAbstraction.services',
    'svgAbstraction.filters',
    'ui.bootstrap',
    'menuAim',
    'liveResource',
    'ui.router',
//    'ngAnimate',
    'colorpicker.module',
    'ui.select2'
//    'ngSvg'
  ];

  angular.module('svgAbstraction', using)
    .config(function ($stateProvider) {
      $stateProvider.state('svgAbstraction', {
        url:'/svgAbstraction/:id',
        templateUrl:'modules/svgAbstraction/svgAbstraction.html',
        controller:'svgAbstractionCtrl',
        resolve: {
          liveResource: function (liveResourceProvider) {
            return liveResourceProvider.createLiveResource;
          }
        }
      });
    });

  angular.module('svgAbstraction.controllers', ['colorpicker.module', 'ui.select2']);
  angular.module('svgAbstraction.services',[]);
  angular.module('svgAbstraction.directives', []);
  angular.module('svgAbstraction.filters', []);
}());