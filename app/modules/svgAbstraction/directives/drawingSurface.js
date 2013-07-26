(function () {
  angular.module('svgAbstraction.directives')
    .directive('drawingSurface', function ($compile) {
      return {
        restrict: 'A',
        require: '^ngSvg',
        scope: {

        },
        link: function drawingSurfaceLink($scope, ngSvgController) {
          var ngSvg = ngSvgController;

          var surface = drawSurface(ngSvg);

          $compile(surface)($scope);
        }
      };

      function drawSurface(ngSvg) {
        var surface = svg.rect(ngSvg.drawingGroup, 0, 0, '100%', '100%', {
//          id: 'surface',
          fill: 'white'
//          stroke: 'black'
//          'stroke-width': 4
        });
      }
    }
  );
})();