(function () {
  angular.module('svgAbstraction.directives')
    .directive('shape', function ($compile, $timeout) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          top: '=',
          left: '=',
          midPointX: '=',
          midPointY: '=',

          d: '=',
          fill: '=',
          stroke: '=',
          strokeWidth: '=',

          draggable: '=',

          whenClick: '&',
          svgElement: '='
        },
        controller: function($scope){
//          $scope.midPointX = 0;
//          $scope.midPointY = 0;
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

        setupShapeEvents($scope, shape);
        setMidpointOfShape($scope, shape, ngSvg);

        return parentGroup;
      };

      function setupShapeEvents($scope, shape) {
        // HACK: ugh
        $(shape).mousedown(function () {
          $scope.$apply(function () {
            $scope.whenClick();
          });
        });
      }

      function setMidpointOfShape($scope, shape, ngSvg){
        $timeout(function() {
          var selectionBox = ngSvg.getSelectionBox(shape);
          $scope.midPointX = selectionBox.width / 2;
          $scope.midPointY = selectionBox.height / 2;
        });
      }
    });
})();