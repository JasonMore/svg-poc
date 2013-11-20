(function () {
  'use strict';

  var using = [
    'templateList.controllers',
    'templateList.directives',
    'templateList.services',
    'liveResource',
    'ui.bootstrap'
  ];

  angular.module('templateList', using)
    .config(function ($routeProvider) {
      $routeProvider.when('/templates', {
        templateUrl:'modules/templateList/templateList.html',
        controller:'templateListCtrl',
        resolve: {
          liveResource: liveResourceFactory
        }
      });

      $routeProvider.when('/template/:id', {
        templateUrl:'modules/templateList/template.html',
        controller:'templateCtrl',
        resolve: {
          liveResource: liveResourceFactory
        }
      });
    });

  angular.module('templateList.controllers',[]);
  angular.module('templateList.services',[]);
  angular.module('templateList.directives', []);

  function liveResourceFactory(liveResourceProvider) {
    return liveResourceProvider.createLiveResource;
  }
}());