(function () {
  'use strict';

  var using = [
    'templateList.controllers',
    'templateList.directives',
    'templateList.services'
//    'ui.bootstrap',
//    'menuAim'
//    'ngSvg'
  ];

  angular.module('templateList', using)
    .config(function ($routeProvider) {
      $routeProvider.when('/templates', {
        templateUrl:'modules/templateList/templateList.html',
        controller:'templateListCtrl'
      });
    });

  angular.module('templateList.controllers',[]);
  angular.module('templateList.services',[]);
  angular.module('templateList.directives', []);
}());