(function () {
  'use strict';

  var using = [
    'liveResource',
    'ui.bootstrap',
    'ui.router'
  ];

  angular.module('templates', using)
    .config(function ($stateProvider) {
      $stateProvider
        .state('templates', {
          abstract: true,
          url: "/templates",
          templateUrl: "modules/templates/templatesShell.html"
        })
        .state('templates.list', {
          url: '',
          templateUrl: 'modules/templates/templateTypes.html',
          controller: 'templateTypesCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        })
        .state('templates.item', {
          url: "/{id}",
          templateUrl: "modules/templates/templates.html",
          controller: 'templatesCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        });
    });

  function liveResourceFactory(liveResourceProvider) {
    return liveResourceProvider.createLiveResource;
  }
}());