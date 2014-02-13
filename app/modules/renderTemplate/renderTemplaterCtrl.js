(function() {
  "use strict";

  angular.module('renderTemplate')
    .controller('renderTemplateCtrl', function($scope, $stateParams, liveResource, shapeViewModelService, textReflowService, dataMergeService) {

      // load data
      var templateKey = 'templates.' + $stateParams.templateId;
      var liveTemplate = liveResource(templateKey);
      $scope.liveTemplate = liveTemplate;
      $scope.template = liveTemplate.get();

      var dataKey = 'students' + $stateParams.dataSet;
      var liveStudents = liveResource(dataKey);
      $scope.students = liveStudents.get();

      var liveVocabulary = liveResource('vocabulary');
      $scope.vocabulary = liveVocabulary.get();

      // propeties
      $scope.templatedShapes = {};
$scope.mergeDataId = $stateParams.dataSet;


      // computed
      $scope.computedShapes = function computedShapes() {
        return $scope.templatedShapes;
      };

      // actions
      var updateAllTextReflows = _.debounce(function() {
        textReflowService.recalculateAllText($scope.computedShapes());
      }, 200);

      // watch
      $scope.$watch('mergeDataId', function(mergeDataId, oldValue) {
        if (mergeDataId === oldValue) return;

        if (!mergeDataId) {
          updateAllTextReflows();
          $scope.shapesCopy = null;
          return;
        }

        // by only copying the shapes in between merges, prevents flicker
        // when updating template data or changing templates
        if (!oldValue) {
          $scope.templatedShapes = {};
          $scope.shapesCopy = angular.copy($scope.template.shapes);

          _($scope.shapesCopy).each(function(shape) {
            $scope.templatedShapes[shape.id] = shapeViewModelService.create(shape);
          });
        }

        applyTemplateDataToTemplateShapes();

        updateAllTextReflows();
      });

      function applyTemplateDataToTemplateShapes() {
        var data = $scope.students[$scope.mergeDataId];
        var mergedShapes = dataMergeService.shapesWithData($scope.template.shapes, data);
        _.merge($scope.shapesCopy, mergedShapes);
      }

    });
});