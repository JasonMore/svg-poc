(function () {
  angular.module('svgAbstraction.controllers', [])
    .controller('svgAbstractionCtrl', function ($scope, $routeParams, $timeout, shapePaths, shapeViewModelService, liveResource, textReflowService) {
      window.debugScope = $scope;

      // load data
      var templateKey = 'templates.' + $routeParams.id;
      var liveTemplate = liveResource(templateKey);
      $scope.template = liveTemplate.subscribe();

      // lets you do crud on templates.[id].shapes directly
      var liveShapes = liveTemplate.scope('shapes');

      // properties
      $scope.selectedShape = null;
      $scope.shapeToDraw = null;
      $scope.shapePaths = shapePaths.list;
      $scope.shapeKeyValues = shapePaths.keyValues;
      $scope.shapes = {};

      $scope.colorOptions = [
        {id: 'red', name: 'Red'},
        {id: 'yellow', name: 'Yellow'},
        {id: 'green', name: 'Green'},
        {id: 'blue', name: 'Blue'},
        {id: 'white', name: 'White'},
        {id: 'gray', name: 'Gray'},
        {id: 'black', name: 'Black'},
        {id: 'none', name: '-- None -- '}
      ];

      $scope.strokeWidthOptions = [
        {id: 1, name: '1'},
        {id: 2, name: '2'},
        {id: 3, name: '3'},
        {id: 4, name: '4'},
        {id: 5, name: '5'},
        {id: 6, name: '6'},
        {id: 7, name: '7'},
        {id: 8, name: '8'},
        {id: 9, name: '9'},
        {id: 10, name: '10'},
        {id: 11, name: '11'},
        {id: 12, name: '12'},
        {id: 13, name: '13'},
        {id: 14, name: '14'}
      ];

      $scope.fontSizeOptions = [
        {id: '8.0', name: '8'},
        {id: '9.0', name: '9'},
        {id: '10.0', name: '10'},
        {id: '11.0', name: '11'},
        {id: '12.0', name: '12'},
        {id: '13.0', name: '13'},
        {id: '14.0', name: '14'},
        {id: '15.0', name: '15'},
        {id: '16.0', name: '16'},
        {id: '17.0', name: '17'}
      ];

      $scope.fontFamilyOptions = [
        {id: 'Arial', name: 'Arial'},
        {id: 'Cambria', name: 'Cambria'},
        {id: 'Consolas', name: 'Consolas'},
        {id: 'Verdana', name: 'Verdana'}
      ];

      // watches
      $scope.$watch(function () {
        return _.keys($scope.template.shapes).length;
      }, function (newVals, oldVals) {
        // find shapes that were removed remotely
        var viewModelIds = _.keys($scope.shapes);
        var modelIds = _.keys($scope.template.shapes);

        var idsToRemove = _.difference(viewModelIds, modelIds);

        for (var property in $scope.shapes) {
          if (_.contains(idsToRemove, property)) {
//            shiftShapesDown($scope.shapes[property].model.order);
            delete $scope.shapes[property];
          }
        }

        // find shapes that were added
        viewModelIds = _.keys($scope.shapes);
        var idsToAdd = _.difference(modelIds, viewModelIds);

        _.each(idsToAdd, function (id) {
          function getModelFn() {
            return $scope.template.shapes[id];
          }

          $scope.shapes[id] = shapeViewModelService.create(nextOrderNumber(), getModelFn);
        });

      });

      var updateAllTextReflows = _.debounce(function () {
        textReflowService.recalculateAllText($scope.shapes);
      }, 200);

      $scope.$watch('template.shapes', function () {
        if ($scope.selectedShape && $scope.selectedShape.isEditingText) {
          return;
        }

        updateAllTextReflows();
      });

      // actions
      $scope.setSelectedShape = function (shape) {
        if ($scope.selectedShape === shape) {
          return;
        }

        // sent a model instead of viewmodel
        if (!shape.model) {
          $timeout(function () {
            var viewModel = _.find($scope.shapes, function (viewModel) {
              return viewModel.model.id === shape.id;
            });
            $scope.setSelectedShape(viewModel);
          });
          return;
        }

        $scope.unSelectShape();

        // when creating a new shape, its not always drawn yet
        $timeout(function () {
          $scope.selectedShape = shape;
          $scope.shapeToDraw = null;
        })
      };

      $scope.deleteShape = function () {
        liveShapes.del($scope.selectedShape.model.id);
        $scope.unSelectShape();
      };

      $scope.canDragShape = function (shape) {
        return true;
      };

      $scope.drawShape = function (shape) {
        $scope.unSelectShape();

        // if they click the button twice, undo
        if ($scope.shapeToDraw === shape) {
          $scope.shapeToDraw = null;
        } else {
          $scope.shapeToDraw = shape;
        }
      };

      $scope.unSelectShape = function () {
        if (!$scope.selectedShape) {
          return;
        }

        if ($scope.selectedShape.isEditingText) {
          updateAllTextReflows();
        }

        $scope.selectedShape.isEditingText = false;
        $scope.selectedShape.showPreviewImage = false;
        $scope.selectedShape = null;

        // HACK
        updateAllTextReflows();
      };

      $scope.shapeDrawn = function (shape) {
        liveShapes.add(shape);
        $scope.setSelectedShape(shape);
      };

      $scope.fontSize = function (addHowMuch) {
        addHowMuch = parseInt(addHowMuch);
        oldValue = parseInt($scope.selectedShape.model.fontSize)
        $scope.selectedShape.model.fontSize = oldValue + addHowMuch;
      };

      $scope.copyCurrentShape = function () {
        if (!$scope.selectedShape) return;
        $scope.copiedShapeModel = angular.copy($scope.selectedShape.model);
        delete $scope.copiedShapeModel.id;
      };

      $scope.pasteCopiedShape = function () {
        // offset new shape
        $scope.copiedShapeModel.top += 25;
        $scope.copiedShapeModel.left += 25;
        $scope.copiedShapeModel.order = nextOrderNumber();

        liveShapes.add($scope.copiedShapeModel);
        $scope.setSelectedShape($scope.copiedShapeModel);
//        $scope.copyCurrentShape();
        $scope.copiedShapeModel = null;
      };

      // computed
      $scope.shapeType = function () {
        if ($scope.shapeToDraw) {
          return $scope.shapeToDraw.key;
        }
      };

      $scope.isDrawing = function () {
        return _.isObject($scope.shapeToDraw);
      };

      $scope.isActiveShape = function (shape) {
        return $scope.shapeToDraw === shape;
      };

      $scope.menuTop = function () {
        if (!$scope.selectedShape) {
          return 0;
        }
        return $scope.selectedShape.model.top + 30;
      };

      $scope.menuLeft = function () {
        if (!$scope.selectedShape) {
          return 0;
        }

        return $scope.selectedShape.left() + $scope.selectedShape.width() - 120;
      };

      $scope.showShapeMenu = function () {
        if (!$scope.selectedShape) {
          return false;
        }

        if ($scope.selectedShape.isDragging) {
          return false;
        }

        if ($scope.selectedShape.isResizing) {
          return false;
        }

        return true;
      };

      // keyboard shortcuts

      kDown.whenShortcut("esc", function () {
        $scope.$apply(function () {
          $scope.unSelectShape();
        });
      });

      kDown.whenShortcut("cmd+c", function () {
        $scope.$apply(function () {
          $scope.copyCurrentShape();
        });
      });

      kDown.whenShortcut("cmd+v", function () {
        if (!$scope.copiedShapeModel) return;

        $scope.$apply(function () {
          $scope.pasteCopiedShape();
        });
      });

      kDown.whenDown('backspace', function (e) {
//        console.log(e)
        if (!$scope.selectedShape) return;

        $scope.$apply(function () {
          $scope.deleteShape();
        });

      });

      // shape ordering
      function nextOrderNumber() {
        return _.keys($scope.shapes).length;
      }

      $scope.canMoveUp = function (shape) {
        var newOrderSpot = shape.model.order + 1;
        return newOrderSpot !== nextOrderNumber();
      };

      $scope.canMoveDown = function (shape) {
        var newOrderSpot = shape.model.order - 1;
        return newOrderSpot !== -1;
      };

      $scope.moveUp = function (shape) {
        if (!$scope.canMoveUp(shape)) return;

        var newOrderSpot = shape.model.order + 1;

        shiftShapesDown(newOrderSpot);

        shape.model.order = newOrderSpot;
      };

      function shiftShapesDown(afterOrderSpot){
        _($scope.shapes)
          .where(function (shape) {
            return shape.model.order >= afterOrderSpot;
          })
          .each(function (shape) {
            shape.model.order -= 1;
          });
      }

      $scope.moveDown = function (shape) {
        if (!$scope.canMoveDown(shape)) return;

        var newOrderSpot = shape.model.order - 1;

        _($scope.shapes)
          .where(function (shape) {
            return shape.model.order <= newOrderSpot;
          })
          .each(function (shape) {
            shape.model.order += 1;
          });

        shape.model.order = newOrderSpot;
      };

    });
}());