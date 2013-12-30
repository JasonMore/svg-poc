(function () {
  'use strict';

  var using = [
    'liveResource',
    'ui.router'
  ];

  angular.module('testData', using)
    .config(function ($stateProvider) {
      $stateProvider
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
    });

  function liveResourceFactory(liveResourceProvider) {
    return liveResourceProvider.createLiveResource;
  }
}());