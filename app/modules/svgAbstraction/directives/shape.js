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
        link: function (scope, element, attr, ngSvgController) {

          var parentGroup = drawShape(scope, attr, ngSvgController.svg);
          scope.svgElement = parentGroup;

          $compile(parentGroup)(scope);

          // attach svg element to dom element so we can access it from other directives
          element.data('parentGroup', parentGroup);

          scope.$on("$destroy", function () {
            ngSvgController.svg.remove(parentGroup);
          });
        }
      };

      function drawShape(scope, attr, svg){
        // TODO: get half width / half height for rotate center point
        scope.midPointX = 50;
        scope.midPointY = 50;

        var transform = 'translate({{left}},{{top}}), rotate(0,{{midPointX}},{{midPointY}})';
        var parentGroup = svg.group({ transform: transform });

        var shape = svg.path(parentGroup, '', {
          'class': 'shape',
          'fill':'{{fill}}',
          'stroke':'{{stroke}}',
          'stroke-width':'{{strokeWidth}}',
          //'ng-click': scope.whenClick,
          // not sure why "d" is the only one that needs ng-attr
          // jquery.svg throws error without "ng-attr"
          'ng-attr-d':'{{d}}'
        });

        $(shape).click(scope.whenClick);

        return parentGroup;
      };
    });
})();