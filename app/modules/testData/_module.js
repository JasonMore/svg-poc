(function(){
  'use strict';

  var using = [
    'testData.controllers',
    'testData.services',
    'liveResource'
  ];

  angular.module('testData', using)
    .config(function($routeProvider) {
      $routeProvider.when('/testData', {
        templateUrl: 'modules/testData/testData.html'
      });

      $routeProvider.when('/testData/templates', {
        templateUrl: "modules/testData/templates.html",
        controller:'templatesCtrl',
        resolve: {
          liveResource: liveResourceFactory
        }
      });

      $routeProvider.when('/testData/students', {
        templateUrl: "modules/testData/students.html",
        controller:'studentsCtrl',
        resolve: {
          liveResource: liveResourceFactory
        }
      });
    });

  angular.module('testData.controllers',[]);
  angular.module('testData.services',[]);

  function liveResourceFactory(liveResourceProvider) {
    return liveResourceProvider.createLiveResource;
  }
}());