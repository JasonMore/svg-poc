(function () {
  'use strict';

  var using = [
    'templateList.controllers',
    'templateList.directives',
    'templateList.services',
    'liveResource'
  ];

  angular.module('templateList', using)
    .config(function ($routeProvider) {
      $routeProvider.when('/templates', {
        templateUrl:'modules/templateList/templateList.html',
        controller:'templateListCtrl',
        resolve: {
          liveResource: function (liveResourceProvider) {
            return liveResourceProvider.createLiveResource;
          }
        }
      });
    });

  angular.module('templateList.controllers',[]);
  angular.module('templateList.services',[]);
  angular.module('templateList.directives', []);
}());