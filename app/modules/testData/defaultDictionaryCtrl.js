(function() {
  angular.module('testData.controllers')
    .controller('defaultDictionaryCtrl', function($scope, liveResource) {
      // load data
      var liveTemplateType = liveResource(templateKey);
      $scope.templateType = liveTemplateType.subscribe();

    });
}());