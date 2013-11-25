(function () {
  'use strict';

  var using = [
    'testData.controllers',
    'testData.services',
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
          controller: 'templatesCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        })
        .state('testData.students', {
          url: '/students',
          templateUrl: "modules/testData/students.html",
          controller: 'studentsCtrl',
          resolve: {
            liveResource: liveResourceFactory
          }
        });
    });

  angular.module('testData.controllers', []);
  angular.module('testData.services', []);

  function liveResourceFactory(liveResourceProvider) {
    return liveResourceProvider.createLiveResource;
  }
}());