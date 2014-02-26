(function() {
  'use strict';
  var using = [
    'ui.router',
    'ui.bootstrap',
    'ui.router',
    'liveResource',
    'colorpicker.module',
    'ui.select2',
    'ui.sortable'
  ];

  var app = angular.module('svg-poc', using)
    .config(function($urlRouterProvider, $sceDelegateProvider, $stateProvider) {
      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state('main', {
          url: "/",
          templateUrl: "modules/main/main.html",
          controller: 'mainCtrl'
        })

        .state('svgAbstraction', {
          url: '/svgAbstraction/:id',
          templateUrl: 'modules/svgAbstraction/svgAbstraction.html',
          controller: 'svgAbstractionCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        })

        .state('renderTemplate', {
          url: '/renderTemplate/:templateId?dataSetId',

          templateUrl: 'modules/renderTemplate/renderTemplate.html',
          controller: 'renderTemplateCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        })

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
        })

        .state('testData', {
          url: '/testData',
          templateUrl: 'modules/testData/testData.html'
        })
        .state('testData.templates', {
          url: '/templates',
          templateUrl: "modules/testData/templates.html",
          controller: 'testData.templatesCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        })
        .state('testData.students', {
          url: '/students',
          templateUrl: "modules/testData/students.html",
          controller: 'testData.studentsCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        })
        .state('testData.vocabulary', {
          url: '/vocabulary',
          templateUrl: "modules/testData/vocabulary.html",
          controller: 'testData.vocabularyCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        });

      function liveResourceFactory(liveResourceProvider) {
        return liveResourceProvider.createLiveResource;
      }

      $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',

        // HACK
        // Allow loading assets from anywhere.
        '**'
      ]);
    });

}());