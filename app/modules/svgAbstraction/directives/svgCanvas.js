(function() {
  angular.module('svgAbstraction.directives')
    .directive('svgCanvas', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgAbstraction/directives/svgCanvas.html',
        replace: true,
        scope: {
          template: '=',
          computedShapes: '=',
          selectedShape: '=',
          shapeToDraw: '=',
          zoom: '='
        },
        controller: 'svgCanvasCtrl'
      };
    })
    .controller('svgCanvasCtrl', function($scope, shapeViewModelService, $timeout) {
      window.debugSvgCanvasCtrl = $scope;

      // Properties

      $scope.shadowShape = null;
      $scope.showDrawMenu = false;
      $scope.showSettingsMenu = false;
      $scope.showDataMenu = false;

      // Actions
      $scope.setSelectedShape = function(shape) {
        if ($scope.selectedShape === shape || $scope.mergeDataId) {
          return;
        }

        // sent a model instead of viewmodel when shape was created
        if (!shape.model) {
          $timeout(function() {
            var viewModel = _.find($scope.computedShapes(), function(viewModel) {
              return viewModel.model.id === shape.id;
            });

            if(viewModel){
              $scope.setSelectedShape(viewModel);
            } else {
              // if shape has not been saved yet, do another setTimeout
              $scope.setSelectedShape(shape);
            }
          });
          return;
        }

        $scope.unSelectShape();

        // when creating a new shape, its not always drawn yet
        $timeout(function() {
          $scope.selectedShape = shape;
          $scope.shapeToDraw = null;
        })
      };

      // Functions
      $scope.canDragShape = function (shape) {
        //TODO: add way to disable dragging
        return !$scope.mergeDataId;
      };

      function unSelectShape() {
        $scope.shadowShape = null;

        if (!$scope.selectedShape) {
          return;
        }

        $scope.selectedShape.isEditingText = false;
        $scope.selectedShape.showPreviewImage = false;
        $scope.selectedShape = null;
        $scope.$emit('unSelectShape');
      }

      // Computed

      // Clicks
      $scope.unSelectShape = unSelectShape;

      $scope.shapeClick = function shapeClick(viewModel) {
        $scope.setSelectedShape(viewModel);
        $scope.$emit('shapeClick', viewModel);
      };

      // Watches
      $scope.$watch('selectedShape', function(selectedShape, oldSelectedShape) {
        if (!selectedShape || selectedShape === oldSelectedShape) return;

        var modelCopy = angular.copy($scope.selectedShape.model);
        $scope.shadowShape = shapeViewModelService.create(modelCopy);
      });

      $scope.$watch('selectedShape.model', function() {
        if(!$scope.selectedShape) return;

        _.merge($scope.shadowShape.model, $scope.selectedShape.model);
      }, true);

      // events
      $scope.$on('blankSpaceOnBodyClicked',unSelectShape);
      $scope.$on('shapePickedForDrawing', unSelectShape);
      $scope.$on('behindCanvasClick', unSelectShape);
      $scope.$on('shapeDeleted', unSelectShape);

      $scope.$on('shapeDoneResizing', function($event) {
        _.merge($scope.selectedShape.model, $scope.shadowShape.model);
      });

      $scope.$on('shapeDoneDragging', function($event) {
        _.merge($scope.selectedShape.model, $scope.shadowShape.model);
      });

      $scope.$on('shapeDrawn', function(event, shape){
        $scope.setSelectedShape(shape);
      });
    });
}());