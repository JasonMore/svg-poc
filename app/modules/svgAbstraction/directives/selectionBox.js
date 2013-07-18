(function () {
  angular.module('svgAbstraction.directives')
    .directive('selectionBox', function () {
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

          draggable: '='
        },
        link: function (scope, element, attr, ngSvgController) {

          var parentGroup = drawShape(scope, ngSvgController);

          $compile(parentGroup)(scope);

          // attach svg element to dom element so we can access it from other directives
          element.data('parentGroup', parentGroup);

          scope.$on("$destroy", function () {
            ngSvgController.svg.remove(parentGroup);
          });
        }
      };
    })
  ;
})();