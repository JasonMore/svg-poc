(function () {
  angular.module('svgShell.directives')
    .directive('svgSketchpad', function (surfaceService, drawService) {
      return {
        restrict: 'E',
        template: '<div style="border:1px; width: 100%; height: 300px;"></div>',
        replace: 'true',
        link: function svgSketchpadLink(scope, el, attrs){
          $(el).svg({onLoad: function (svg) {
            surfaceService.svgsketch = el;
            surfaceService.svg = svg;
            surfaceService.surface = svg.rect(0, 0, '100%', '100%', {
              id: 'surface',
              fill: 'white',
              stroke: 'black',
              'stroke-width': 4
            });

            surfaceService.resetSize('100%', '100%');
            drawService.setupDrawMouseBindings();
          }});
        }
      }
    })
  ;
})();