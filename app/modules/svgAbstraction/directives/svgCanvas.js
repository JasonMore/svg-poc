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
          zoom: '='
        },
        controller: 'svgCanvasCtrl'
      };
    })
    .controller('svgCanvasCtrl', function($scope, shapeViewModelService) {
      //shape things
      // -- selection
      // -- unselection
      //
      window.debugSvgCanvasCtrl = $scope;
//      $scope.template = $scope.canvas.template;
//      $scope.shapes = $scope.canvas.shapes;
//      $scope.computedShapes = $scope.canvas.computedShapes;
//      $scope.selectedShape = $scope.canvas.selectedShape;

      $scope.shadowShape = null;

      // functions
      $scope.canDragShape = function (shape) {
        //TODO: add way to disable dragging
        return !$scope.mergeDataId;
      };

      // Clicks
      $scope.unSelectShape = function unSelectShape() {
        $scope.shadowShape = null;
        $scope.$emit('unSelectShape');
      };

      $scope.shapeClick = function shapeClick(viewModel) {
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

    });
}());