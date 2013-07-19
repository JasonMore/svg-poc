(function () {
  angular.module('svgAbstraction.directives')
    .directive('shape', function ($compile) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          top: '=',
          left: '=',

          d: '=',
          fill: '=',
          stroke: '=',
          strokeWidth: '=',

          draggable: '=',

          whenClick: '&',
          svgElement: '='
        },
        controller: function($scope){
//          $scope.svgElment = 'narg';
        },
        link: function ($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController;

          var parentGroup = drawShape($scope, attr, ngSvg);
          $scope.svgElement = parentGroup;

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

      function drawShape($scope, attr, ngSvg){
        // TODO: get half width / half height for rotate center point
        $scope.midPointX = 50;
        $scope.midPointY = 50;

        var transform = 'translate({{left}},{{top}}), rotate(0,{{midPointX}},{{midPointY}})';
        var parentGroup = ngSvg.svg.group(ngSvg.shapeGroup, {
          transform: transform
        });

        var shape = ngSvg.svg.path(parentGroup, '', {
          'class': 'shape',
          'fill':'{{fill}}',
          'stroke':'{{stroke}}',
          'stroke-width':'{{strokeWidth}}',
//          'shape-rendering':'{{isDragging() ? ',
          //'ng-click': scope.whenClick,
          // not sure why "d" is the only one that needs ng-attr
          // jquery.svg throws error without "ng-attr"
          'ng-attr-d':'{{d}}'
        });

        // HACK: ugh
        $(shape).mousedown(function() {
          $scope.$apply(function() {
            $scope.whenClick();
          });
        });

        return parentGroup;
      };
    });
})();