(function () {
  angular.module('svgAbstraction.controllers', [])
    .controller('svgAbstractionCtrl', function ($scope, $routeParams, $timeout, shapePaths, shapeViewModelService, liveResource) {
      window.debugScope = $scope;

      // load data
      var liveTemplate = liveResource('templates.' + $routeParams.id);
      $scope.template = liveTemplate.subscribe();

      // properties
      $scope.selectedShape = null;
      $scope.shapeToDraw = null;
      $scope.shapePaths = shapePaths.list;
      $scope.shapeKeyValues = shapePaths.keyValues;
      $scope.shapes = [];

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
      $scope.$watchCollection('template.shapes', function() {
        // find shapes that were removed remotely
        var viewModelIds = _.map($scope.shapes, function(shape){
          return shape.model.id;
        });

        var modelIds = _.pluck($scope.template.shapes, 'id');

        var idsToRemove = _.difference(viewModelIds, modelIds);

        _.remove($scope.shapes, function(shape) {
          return _.contains(idsToRemove, shape.model.id);
        })

        // find shapes that were added
        viewModelIds = _.map($scope.shapes, function(shape){
          return shape.model.id;
        });

        var idsToAdd = _.difference(modelIds, viewModelIds);

        var shapeModelsToAdd = _.filter($scope.template.shapes, function(model) {
          return _.contains(idsToAdd, model.id);
        })

        _.each(shapeModelsToAdd, function(model) {
          $scope.shapes.push(shapeViewModelService.create(model));
        })

      });

      $scope.$watchCollection('shapes', function() {
        // find shapes that were removed locally
        var viewModelIds = _.map($scope.shapes, function(shape){
          return shape.model.id;
        });

        var modelIds = _.pluck($scope.template.shapes, 'id');

        var idsToRemove = _.difference(modelIds, viewModelIds);

        _.remove($scope.template.shapes, function(model) {
          return _.contains(idsToRemove, model.id);
        })

        // find shapes that were added
        modelIds = _.pluck($scope.template.shapes, 'id');

        var idsToAdd = _.difference(viewModelIds, modelIds);

        var shapeViewModelsToAdd = _.filter($scope.shapes, function(shape) {
          return _.contains(idsToAdd, shape.model.id);
        })

        if(!$scope.template.shapes){
          $scope.template.shapes = [];
        }

        _.each(shapeViewModelsToAdd, function(shape) {
          $scope.template.shapes.push(shape.model);
        });
      });


      // actions
      $scope.setSelectedShape = function (shape) {
        if ($scope.selectedShape === shape) {
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
        $scope.shapes.remove($scope.selectedShape);
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

        $scope.selectedShape.showPreviewImage = false;
        $scope.selectedShape = null;
      };

      $scope.shapeDrawn = function(shape){
        $scope.shapes.push(shape);
        $scope.setSelectedShape(shape);
      }

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

        return $scope.selectedShape.model.left + $scope.selectedShape.width() - 120;
      };

      $scope.shapesInfo = function () {
        return _.map($scope.shapes, function (shapeViewmodel) {
          return shapeViewmodel.model;
        });
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

    });
}());