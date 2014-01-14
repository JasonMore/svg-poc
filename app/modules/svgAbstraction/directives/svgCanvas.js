(function() {
  angular.module('svgAbstraction.directives')
    .directive('svgCanvas', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgAbstraction/directives/svgCanvas.html',
        replace: true,
        scope: {
          canvas: '='
        },
        controller: 'svgCanvasController'
      };
    })
    .controller('svgCanvasController', function($scope) {
      $scope.template = $scope.canvas.template;
      $scope.shapes = $scope.canvas.shapes;
      $scope.computedShapes = $scope.canvas.computedShapes;

      // Clicks
      $scope.unSelectShape = function unSelectShape() {
        $scope.$emit('unSelectShape');
      };

      $scope.shapeClick = function shapeClick(viewModel) {
        $scope.$emit('shapeClick', viewModel);
      }
    });
}());