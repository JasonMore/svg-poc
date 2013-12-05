(function () {
  'use strict';

  var using = [
    'templates.controllers',
    'templates.directives',
    'templates.services',
    'liveResource',
    'ui.bootstrap',
    'ui.router'
  ];

  angular.module('templates', using)
    .config(function ($stateProvider) {
      $stateProvider
        .state('templates', {
          abstract:true,
          url: "/templates",
          templateUrl: "modules/templates/templatesShell.html"
        })
        .state('templates.list', {
          url:'',
          templateUrl:'modules/templates/templateTypes.html',
          controller: 'templateTypesCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        })
        .state('templates.item', {
          url: ":id",
          templateUrl: "modules/templates/templates.html",
          controller: 'templatesCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        });
    });

  angular.module('templates.controllers', []);
  angular.module('templates.services', []);
  angular.module('templates.directives', []);

  function liveResourceFactory(liveResourceProvider) {
    return liveResourceProvider.createLiveResource;
  }
}());