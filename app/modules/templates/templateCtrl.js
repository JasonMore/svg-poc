(function() {
  angular.module('templates.controllers')
    .controller('templateCtrl', function($scope, $stateParams, liveResource) {

      // load data
      var templateKey = 'templateTypes.' + $stateParams.id;
      var liveTemplateType = liveResource(templateKey);
      $scope.templateType = liveTemplateType.subscribe();

      var liveTemplates = liveResource('templates');
      var templatesQuery = liveTemplates.query({templateType: $stateParams.id});
      $scope.templates = liveTemplates.subscribe(templatesQuery);
    });
}());