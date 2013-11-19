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
          liveResource: function (liveResourceProvider) {
            return liveResourceProvider.createLiveResource;
          }
        }
      })
    });

  angular.module('testData.controllers',[]);
  angular.module('testData.services',[]);
}());