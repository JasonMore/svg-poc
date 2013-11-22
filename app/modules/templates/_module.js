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
          url: "/templates",
          templateUrl: "modules/templates/templates.html",
          controller: 'templatesCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        })
        .state('template', {
          url: "/template/:id",
          templateUrl: "modules/templates/template.html",
          controller: 'templateCtrl',
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