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
    'ngAnimate',
    'colorpicker.module'
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

  angular.module('svgAbstraction.controllers', ['ngAnimate', 'colorpicker.module']);
  angular.module('svgAbstraction.services',[]);
  angular.module('svgAbstraction.directives', []);
  angular.module('svgAbstraction.filters', []);
}());