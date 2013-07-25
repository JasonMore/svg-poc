(function () {
  angular.module('svgAbstraction.directives')
    .directive('ngShape', function ($compile, $timeout, pathService) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          model:'=',
          draggable: '=',
          whenClick: '&'
        },
        link: function ($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController;

          var parentGroup = drawShape($scope, ngSvg);
          $scope.model.svgElement = angular.element(parentGroup);

          $compile(parentGroup)($scope);

          // attach svg element to dom element so we can access it from other directives
          element.data('parentGroup', parentGroup);

          $scope.isDragging = function(){
            return ngSvg.isDragging && ngSvg.selectedShape === parentGroup;
          };

          $scope.$on("$destroy", function () {
            ngSvg.svg.remove(parentGroup);
          });
        }
      };

      function drawShape($scope, ngSvg) {
        var transform = [
          'translate({{model.left}},{{model.top}})',
          'rotate({{model.rotation}},{{model.midPointX}},{{model.midPointY}})'
        ];

        var parentGroup = ngSvg.svg.group(ngSvg.shapeGroup, {
          transform: transform.join(', ')
        });

        var shape = ngSvg.svg.path(parentGroup, '', {
          'class': 'shape',
          'fill':'{{model.backgroundColor}}',
          'stroke':'{{model.borderColor}}',
          'stroke-width':'{{model.borderWidth}}',
          'ng-mousedown': 'whenClick()',

          // not sure why "d" is the only one that needs ng-attr
          // jquery.svg throws error without "ng-attr"
          'ng-attr-d':'{{model.path}}'
        });

        setMidpointOfShape($scope, shape);

        return parentGroup;
      };

      function setMidpointOfShape($scope, shape){
        // shape needs to be rendered before we can calculate its midpoint
        $timeout(function() {
          var selectionBox = pathService.getSelectionBox(shape);
          $scope.model.midPointX = (selectionBox.width - $scope.model.borderWidth) / 2;
          $scope.model.midPointY = (selectionBox.height - $scope.model.borderWidth) / 2;
        });
      }
    });
})();