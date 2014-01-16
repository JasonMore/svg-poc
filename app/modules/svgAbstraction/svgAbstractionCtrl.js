(function() {
  angular.module('svgAbstraction.controllers')
    .controller('svgAbstractionCtrl', function($scope, $stateParams, $timeout, shapeViewModelService, liveResource, textReflowService, dotNotation, $modal, dataMergeService) {
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

      var updateAllTextReflows = _.debounce(function() {
        textReflowService.recalculateAllText($scope.computedShapes());
      }, 200);

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
        var mergedShapes = dataMergeService.getMergedShapesWithData($scope.shapesCopy, data);
        _.merge($scope.shapesCopy, mergedShapes);
      }

      $scope.$watch('vocabulary', computedVocabularyGroup, true);
      function computedVocabularyGroup(vocabulary, oldValues) {
        if (vocabulary === oldValues) return;

        $scope.vocabularyGroups = _.groupBy(vocabulary, 'type');
      }

      $scope.$watch('students', function() {
        if (!$scope.mergeDataId) return;
        applyTemplateDataToTemplateShapes()

      }, true);

      // actions

      $scope.deleteShape = function(selectedShape) {
        moveShapesAboveDownOneInOrder(selectedShape);
//        $scope.unSelectShape();
        liveShapes.del(selectedShape.model.id);
        $scope.$broadcast('shapeDeleted', selectedShape);
      };

      $scope.canDragShape = function(shape) {
        return !$scope.mergeDataId;
      };

      $scope.$on('unSelectShape', function() {
        // HACK
        updateAllTextReflows();
      });


      $scope.behindCanvasClick = function() {
        // when the background behind canvas is clicked, let everyone know
        $scope.$broadcast('behindCanvasClick');

        // HACK
        updateAllTextReflows();
      };

      $scope.$on('shapeDrawn', function(event, shape){
        shape.order = nextOrderNumber();

        liveShapes.add(shape);
      });

      $scope.fontSize = function(addHowMuch) {
        addHowMuch = parseInt(addHowMuch);
        var oldValue = parseInt($scope.selectedShape.model.fontSize);
        $scope.selectedShape.model.fontSize = oldValue + addHowMuch;
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

      $scope.exportPdf = function() {
        $scope.unSelectShape();
        $scope.$broadcast('submitSvgToBatik');
      };

      $scope.mergeData = function(id) {
        $scope.mergeDataId = id;
      };

//      var bindingViewMap = {
//        'background': 'color',
//        'borderColor': 'color',
//        'fontColor': 'color',
//        'image': 'image'
//      };

//      $scope.openBindingsWindow = function(selectedShape, property) {
//        if (!selectedShape.model.fieldBindings[property]) {
//          selectedShape.model.fieldBindings[property] = {
//            boundTo: '',
//            bindings: {}
//          };
//        }
//
//        var fieldBinding = selectedShape.model.fieldBindings[property];
//        var vocabularyGroups = $scope.vocabularyGroups;
//        var bindingsKey = ['shapes', selectedShape.model.id, 'fieldBindings', property, 'bindings'].join('.');
//        var liveBindings = liveTemplate.scope(bindingsKey);
//
//        var modalInstance = $modal.open({
//          templateUrl: 'modules/svgAbstraction/bindingViews/' + bindingViewMap[property] + '.html',
//          controller: function($scope, $modalInstance) {
////            $scope.isNew = template ? false : true;
////            $scope.template = template || {};
//
//            $scope.fieldBinding = fieldBinding;
//            $scope.vocabularyGroups = vocabularyGroups;
//
//            $scope.addNewBinding = function() {
//              liveBindings.add({type: 'eq', fieldValue: '', overrideValue: ''});
//            };
//
//            $scope.removeBinding = function(binding) {
//              liveBindings.del(binding.id);
//            };
//
//            $scope.save = function() {
//              $modalInstance.close();
//            };
//
//            $scope.cancel = function(isNew) {
//              $modalInstance.dismiss('cancel');
//            };
//          }
//        });
//
//        modalInstance.result.then(function(template) {
////          if(!template.id){
////            template.templateType = $scope.templateType.id;
////            template.created = new Date();
////            liveTemplates.add(template);
////          }
//        });
//      };

      // computed
      $scope.computedShapes = function computedShapes() {
        if ($scope.mergeDataId) {
          return $scope.templatedShapes;
        }

        return $scope.shapes;
      };

      $scope.isDrawing = function() {
        return _.isObject($scope.shapeToDraw);
      };

      // events

      // keyboard shortcuts

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

      // shape ordering
      function nextOrderNumber() {
        return _.keys($scope.shapes).length;
      }

      $scope.canMoveUp = function(shape) {
        if (!shape) return false;
        var newOrderSpot = shape.model.order + 1;
        return newOrderSpot !== nextOrderNumber();
      };

      $scope.canMoveDown = function(shape) {
        if (!shape) return false;
        var newOrderSpot = shape.model.order - 1;
        return newOrderSpot !== -1;
      };

      $scope.moveToTop = function(shape) {
        //TODO: this is a lazy way
        while ($scope.canMoveUp(shape)) {
          $scope.moveUp(shape);
        }
      };

      $scope.moveToBottom = function(shape) {
        //TODO: this is a lazy way
        while ($scope.canMoveDown(shape)) {
          $scope.moveDown(shape);
        }
      };

      $scope.moveUp = function(shape) {
        if (!$scope.canMoveUp(shape)) return;
        moveShape('up', shape);
      };

      $scope.moveDown = function(shape) {
        if (!$scope.canMoveDown(shape)) return;
        moveShape('down', shape);
      };

      function moveShape(direction, shape) {
        var directionInt = direction === 'up' ? 1 : -1;

        var newOrderSpot = shape.model.order + directionInt;

        var originalSpot = _.find($scope.shapes, function(shape) {
          return shape.model.order === newOrderSpot;
        });

        originalSpot.model.order -= directionInt;

        shape.model.order = newOrderSpot;
      }

      function moveShapesAboveDownOneInOrder(selectedShape) {
        var deletedOrder = selectedShape.model.order;

        _($scope.shapes)
          .where(function(shape) {
            return shape.model.order > deletedOrder;
          })
          .each(function(shape) {
            shape.model.order -= 1;
          });
      }
    });
}());