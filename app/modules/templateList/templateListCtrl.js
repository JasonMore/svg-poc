(function () {


  angular.module('templateList.controllers', [])
    .controller('templateListCtrl', function ($scope, liveResource) {

      var templatesLive = liveResource('templates');
      var allTemplatesQuery = templatesLive.query({});
      $scope.templates = templatesLive.subscribe(allTemplatesQuery);

      $scope.add = function () {
        templatesLive.add({ name: $scope.newName});
      };

      $scope.delete = function (template) {
        templatesLive.delete(template);
      };

    });
}());