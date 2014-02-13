(function () {
  'use strict';

  var using = [
    'svgAbstraction'
  ];

  angular.module('renderTemplate', using)
    .config(function ($stateProvider) {
      $stateProvider.state('renderTemplate', {
        url:'/renderTemplate/:templateId?dataSet',
        templateUrl:'modules/renderTemplate/renderTemplate.html',
        controller:'renderTemplateCtrl',
        resolve: {
          liveResource: function (liveResourceProvider) {
            return liveResourceProvider.createLiveResource;
          }
        }
      });
    });
}());