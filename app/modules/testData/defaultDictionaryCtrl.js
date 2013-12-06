(function() {
  angular.module('testData')
    .controller('testData.defaultDictionaryCtrl', function($scope, liveResource) {
      // load data
      var liveTemplateType = liveResource(templateKey);
      $scope.templateType = liveTemplateType.subscribe();

    });
}());