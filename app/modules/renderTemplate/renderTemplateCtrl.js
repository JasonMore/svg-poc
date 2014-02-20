(function() {
  "use strict";

  angular.module('svg-poc')
    .controller('renderTemplateCtrl', function($scope, $stateParams, liveResource, shapeViewModelService, textReflowService, dataMergeService, $timeout, svgReferenceService) {
      window.debugScope = $scope;

      // load data
      var templateKey = 'templates.' + $stateParams.templateId;
      var liveTemplate = liveResource(templateKey);
      $scope.liveTemplate = liveTemplate;
      $scope.template = liveTemplate.subscribe();

      var liveStudents = liveResource('students');
      var studentsQuery = liveStudents.query({});
      $scope.students = liveStudents.subscribe(studentsQuery);

      var liveVocabulary = liveResource('vocabulary');
      var vocabularyQuery = liveVocabulary.query({});
      $scope.vocabulary = liveVocabulary.subscribe(vocabularyQuery);

      // lets you do crud on templates.[id].shapes directly
      var liveShapes = liveTemplate.scope('shapes');
      $scope.liveShapes = liveShapes;

      // add default template data
      if (!$scope.template.width || !scope.template.height) {
        $scope.template.width = 1500;
        $scope.template.height = 1500;
      }

      // propeties
      $scope.zoom = 1;
      $scope.templatedShapes = {};
      $scope.mergeDataId;

      // computed
      $scope.computedShapes = function computedShapes() {
        return $scope.templatedShapes;
      };

      // actions
      var updateAllTextReflows = _.debounce(function() {
        textReflowService.recalculateAllText($scope.computedShapes());
      }, 200);

      // watch


      // wait for shapes and data to load first
      $scope.hasShapes = function() {
        return _.keys($scope.template.shapes).length > 0;
      };

      $scope.hasData = function() {
        return _.keys($scope.students).length > 0;
      };

      $scope.$watch('hasShapes() && hasData()', function(ready) {
        if (!ready) return;
        $scope.mergeDataId = $stateParams.dataSet;
      });

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

      // wait for the dom to settle down
      var exportPdf = _.debounce(function() {

        var status = window.callPhantom({
          emit: 'doneRendering',
          svg: svgReferenceService.svg.toSVG()
        });

        console.log(status);  // Will either print 'Accepted.' or 'DENIED!'

      }, 150);


      $scope.$watch(function() {
        exportPdf();
      });


    });
}());