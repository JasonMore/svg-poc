(function () {
  angular.module('svgShell.directives', [])
    .directive('sketchpad', function (surfaceService) {
      return {
        restrict: 'A',
        template: '<div style="width: 100%; height: 300px;"></div>',
        link: function(scope, el, attrs){
          $(el).svg({onLoad: function (svg) {
            surfaceService.svgsketch = el;
            surfaceService.svg = svg;
            surfaceService.surface = svg.rect(0, 0, '100%', '100%', {
              id: 'surface',
              fill: 'white'
            });

//            sketchpad = svg;
//            var surface = svg.rect(0, 0, '100%', '100%', {id: 'surface', fill: 'white'});
            surfaceService.resetSize('100%', '100%');

            surfaceService.setupDrawMouseBindings();

            //HACKs below
//            parentGroup = svg.group({
//              id: 'parentGroup',
//              transform: 'translate(5, 5) rotate(0, 100, 100)'
//            });
//
//            textSpans = sketchpad.createText().string('');
//
//            text = sketchpad.text(parentGroup, 10, 10, textSpans, {
//              id: 'textBlock',
//              container: 'rect',
//              opacity: 0.7,
//              fontFamily: 'Verdana',
//              fontSize: '10.0',
//              fill: 'blue'
//            });

          }});
        }
      }
    })
  ;
})();