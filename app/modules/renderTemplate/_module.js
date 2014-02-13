(function () {
  'use strict';

  var using = [

  ];

  angular.module('renderTemplate');

  angular.module('renderTemplate', using)
    .config(function ($stateProvider) {
      $stateProvider.state('renderTemplate', {
        url:'/renderTemplate/:templateId?dataset=:dataset',
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