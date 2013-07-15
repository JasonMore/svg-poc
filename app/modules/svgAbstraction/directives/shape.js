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
          strokeWidth: '='
        },
        link: function (scope, element, attr, ngSvgController) {

          // TODO: get half width / half height for rotate center point
          scope.midPointX = 50;
          scope.midPointY = 50;

          var transform = 'translate({{left}},{{top}}), rotate(0,{{midPointX}},{{midPointY}})';
          var parentGroup = ngSvgController.svg.group({ transform: transform });

          var shape = ngSvgController.svg.path(parentGroup, '', {
            'class': 'shape',
            'fill':'{{fill}}',
            'stroke':'{{stroke}}',
            'stroke-width':'{{strokeWidth}}',

            // not sure why "d" is the only one that needs ng-attr
            // jquery.svg throws error without "ng-attr"
            'ng-attr-d':'{{d}}'
          });

          $compile(parentGroup)(scope);

          scope.$on("$destroy", function () {
            ngSvgController.svg.remove(parentGroup);
          });
        }
      };
    });
})();