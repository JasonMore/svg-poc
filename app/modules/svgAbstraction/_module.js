(function () {
  'use strict';

  var using = [
    'ui.bootstrap',
    'menuAim',
    'liveResource',
    'ui.router',
    'colorpicker.module',
    'ui.select2',
    'ui.sortable'
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
}());