(function() {
  "use strict";

  angular.module('svg-poc')
    .controller('renderTemplateCtrl', function($scope, $stateParams, liveResource, shapeViewModelService, textReflowService, dataMergeService, $timeout, svgReferenceService, $http, $document) {
      window.debugScope = $scope;

      // propeties
      $scope.zoom = 1;
      $scope.templatedShapes = {};

      // load data
      var templateKey = 'templates.' + $stateParams.templateId;
      var liveTemplate = liveResource(templateKey);
      $scope.liveTemplate = liveTemplate;
      $scope.template = liveTemplate.subscribe();

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

      // If using dataSetId, fetch student data,
      // otherwise ask server for temp data

      if ($stateParams.dataSetId) {
        var liveStudents = liveResource('students.' + $stateParams.dataSetId);
        $scope.data = liveStudents.get();
      } else {
        $http.get('/getTemplateTempData/' + $stateParams.renderId).then(function(result) {
          $scope.data = result.data;
        });
      }

      // computed
      $scope.computedShapes = function computedShapes() {
        return $scope.templatedShapes;
      };

      // wait for shapes and data to load first
      $scope.hasShapes = function() {
        return _.keys($scope.template.shapes).length > 0;
      };

      $scope.hasData = function() {
        return _.keys($scope.data).length > 0;
      };

      // actions
      var updateAllTextReflows = _.debounce(function() {
        textReflowService.recalculateAllText($scope.computedShapes());
      }, 200);

      // watch
      $scope.$watch('hasShapes() && hasData()', function(ready) {
        if (!ready) return;

        $scope.templatedShapes = {};
        $scope.shapesCopy = angular.copy($scope.template.shapes);

        _($scope.shapesCopy).each(function(shape) {
          $scope.templatedShapes[shape.id] = shapeViewModelService.create(shape);
        });

        applyTemplateDataToTemplateShapes();

        updateAllTextReflows();
      });

      function applyTemplateDataToTemplateShapes() {
        var data = $scope.data;
        var mergedShapes = dataMergeService.shapesWithData($scope.template.shapes, data);
        _.merge($scope.shapesCopy, mergedShapes);
      }

      // wait for the dom to settle down
      var exportPdf = _.debounce(_.once(function() {

        $http.post('/renderTemplate', {
          svgTemplate: svgReferenceService.svg.toSVG(),
          renderId: $stateParams.renderId
        })
          .then(function() {
            $document[0].title = "doneRendering";
          })
          .catch(function(status) {
            $document[0].title = "failedRendering";
          });

      }), 200);

      $scope.$watch(function() {
        exportPdf();
      });
    });
}());