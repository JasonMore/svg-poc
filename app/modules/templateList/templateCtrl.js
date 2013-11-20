(function() {
  angular.module('templateList.controllers')
    .controller('templateCtrl', function($scope, $routeParams, liveResource) {

      // load data
      var templateKey = 'templateTypes.' + $routeParams.id;
      var liveTemplateType = liveResource(templateKey);
      $scope.templateType = liveTemplateType.subscribe();

      var liveTemplates = liveResource('templates');
      var templatesQuery = liveTemplates.query({templateType: $routeParams.id});
      $scope.templates = liveTemplates.subscribe(templatesQuery);
    });
}());