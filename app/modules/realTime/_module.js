(function () {
  'use strict';

  var using = [
//    'realTime.controllers',
//    'svgAbstraction.directives',
    'realTime.services'
//    'ui.bootstrap',
//    'menuAim'
//    'ngSvg'
  ];

  angular.module('svgAbstraction', using);
//    .config(function () {
//      var socket = io.connect();
//    });

  angular.module('realTime.services',[]);
//  angular.module('svgAbstraction.directives', []);
}());