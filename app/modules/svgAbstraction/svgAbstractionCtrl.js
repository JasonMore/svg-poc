(function() {
  angular.module('svgAbstraction')
    .controller('svgAbstractionCtrl', function($scope, $stateParams, shapeViewModelService, liveResource, textReflowService, dataMergeService) {
      window.debugScope = $scope;

      // load data
      var templateKey = 'templates.' + $stateParams.id;
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

      // properties

      $scope.selectedShape = null;
      $scope.shapeToDraw = null;
      $scope.shapes = {};
      $scope.mergeDataId = null;
      $scope.templatedShapes = {};
      $scope.sideMenuOpen = true;
      $scope.zoom = 1;

      // Actions

      $scope.behindCanvasClick = function() {
        // when the background behind canvas is clicked, let everyone know
        $scope.$broadcast('behindCanvasClick');

        // HACK
        updateAllTextReflows();
      };

      $scope.copyCurrentShape = function() {
        if (!$scope.selectedShape) return;
        $scope.copiedShapeModel = angular.copy($scope.selectedShape.model);
        delete $scope.copiedShapeModel.id;
      };

      $scope.pasteCopiedShape = function() {
        if ($scope.mergeDataId) return;

        // offset new shape
        $scope.copiedShapeModel.top += 25;
        $scope.copiedShapeModel.left += 25;
        $scope.copiedShapeModel.order = nextOrderNumber();

        liveShapes.add($scope.copiedShapeModel);

        //TODO: figure out how to set selected shape after paste
//        $scope.setSelectedShape($scope.copiedShapeModel);

        $scope.copiedShapeModel = null;
      };

      var updateAllTextReflows = _.debounce(function() {
        textReflowService.recalculateAllText($scope.computedShapes());
      }, 200);

      // watches
      $scope.$watch(function() {
        return _.keys($scope.template.shapes).length;
      }, function(newVals, oldVals) {
        // find shapes that were removed remotely
        var viewModelIds = _.keys($scope.shapes);
        var modelIds = _.keys($scope.template.shapes);

        var idsToRemove = _.difference(viewModelIds, modelIds);

        for (var property in $scope.shapes) {
          if (_.contains(idsToRemove, property)) {
            delete $scope.shapes[property];
          }
        }

        // find shapes that were added
        viewModelIds = _.keys($scope.shapes);
        var idsToAdd = _.difference(modelIds, viewModelIds);

        _.each(idsToAdd, function(id) {
          function getModelFn() {
            return $scope.template.shapes[id];
          }

          $scope.shapes[id] = shapeViewModelService.create(getModelFn);
        });

      });

      $scope.$watch('template.shapes', function() {
        if ($scope.selectedShape && $scope.selectedShape.isEditingText) {
          return;
        }

        updateAllTextReflows();
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

      $scope.$watch('students', function() {
        if (!$scope.mergeDataId) return;
        applyTemplateDataToTemplateShapes()

      }, true);

      // Functions

      $scope.canDragShape = function(shape) {
        return !$scope.mergeDataId;
      };

      $scope.fontSize = function(addHowMuch) {
        addHowMuch = parseInt(addHowMuch);
        var oldValue = parseInt($scope.selectedShape.model.fontSize);
        $scope.selectedShape.model.fontSize = oldValue + addHowMuch;
      };

      function nextOrderNumber() {
        return _.keys($scope.shapes).length;
      }

//      $scope.mergeData = function(id) {
//        $scope.mergeDataId = id;
//      };

      // Computed

      $scope.computedShapes = function computedShapes() {
        if ($scope.mergeDataId) {
          return $scope.templatedShapes;
        }

        return $scope.shapes;
      };

      $scope.isDrawing = function() {
        return _.isObject($scope.shapeToDraw);
      };

      // Events

      $scope.$on('unSelectShape', function() {
        // HACK
        updateAllTextReflows();
      });

      $scope.$on('shapeDrawn', function(event, shape) {
        shape.order = nextOrderNumber();
        liveShapes.add(shape);
      });

      // Keyboard Shortcuts

      kDown.whenShortcut("esc", function() {
        $scope.$apply(function() {
          if ($scope.mergeDataId) {
            $scope.mergeDataId = null;
          }

//          $scope.unSelectShape();
        });
      });

      kDown.whenShortcut("cmd+c", function() {
        $scope.$apply(function() {
          $scope.copyCurrentShape();
        });
      });

      kDown.whenShortcut("cmd+v", function() {
        if (!$scope.copiedShapeModel) return;

        $scope.$apply(function() {
          $scope.pasteCopiedShape();
        });
      });

//      kDown.whenDown('backspace', function (e) {
//        if (!$scope.selectedShape) return;
//
//        $scope.$apply(function () {
//          $scope.deleteShape();
//        });
//
//      });

    });
}());