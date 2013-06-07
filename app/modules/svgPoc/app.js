'use strict';

angular.module('svgPoc', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'modules/svgPoc/views/main.html',
        controller: 'mainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
