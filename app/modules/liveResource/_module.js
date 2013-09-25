(function () {
  'use strict';

  var using = [
//    'realTime.controllers',
//    'svgAbstraction.directives',
    'liveResource.services'
//    'ui.bootstrap',
//    'menuAim'
//    'ngSvg'
  ];

  angular.module('svgAbstraction', using);
//    .config(function () {
//      var socket = io.connect();
//    });

  angular.module('liveResource.liveResource',[]);
//  angular.module('svgAbstraction.directives', []);
}());