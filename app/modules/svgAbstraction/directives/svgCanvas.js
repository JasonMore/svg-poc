(function() {
  angular.module('svgAbstraction.directives')
    .directive('svgCanvas', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgAbstraction/directives/svgCanvas.html',
        replace: true,
        scope: {
          template: '=',
          shapes: '=',
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

        // sent a model instead of viewmodel
        if (!shape.model) {
          $timeout(function() {
            var viewModel = _.find($scope.shapes, function(viewModel) {
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

//      $scope.shapeDrawn = function(shape) {
//        $scope.$emit('shapeDrawn', shape);
//        shape.order = nextOrderNumber();
//
//        liveShapes.add(shape);
//        $scope.setSelectedShape(shape);
//      };

      $scope.$on('shapeDrawn', function(event, shape){
        $scope.setSelectedShape(shape);
      });

      // Functions
      $scope.canDragShape = function (shape) {
        //TODO: add way to disable dragging
        return !$scope.mergeDataId;
      };

      // Computed

      // Clicks
      $scope.unSelectShape = function unSelectShape() {
        $scope.shadowShape = null;
        $scope.$emit('unSelectShape');
      };

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

      // events
      $scope.$on('shapeDoneResizing', function($event) {
        _.merge($scope.selectedShape.model, $scope.shadowShape.model);
      });

      $scope.$on('shapeDoneDragging', function($event) {
        _.merge($scope.selectedShape.model, $scope.shadowShape.model);
      });

      $scope.$on('shapePickedForDrawing', function($event, shapeForDrawing){
        $scope.unSelectShape();
      });

//      $scope.$on('shapeDrawn')
    });
}());