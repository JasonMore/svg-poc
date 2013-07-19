(function () {
  angular.module('svgAbstraction.directives')
    .directive('ngSvg', function () {
      return {
        restrict: 'E',
        scope: true,
        transclude: true,
        replace: true,
        template: '<div ng-transclude></div>',
        controller: 'ngSvgController'
      };
    })
    .controller('ngSvgController', function($element) {
      var self = this;

      // yes, belongs in link, but easier here
      $element.svg({onLoad: function (svg) {
        self.svg = svg;

        self.shapeGroup = svg.group({class:'shapes'});
        self.selectionGroup = svg.group({class:'selection'});
      }});

      // functions
      this.getSelectionBox = function(shape) {
        var shapeRaw = shape;
        
        // check if its an angular shape
        if(shape.svgElement){
            shapeRaw = $(shape.svgElement).find('.shape')[0];
        }

        var strokeWidth = $(shapeRaw).attr('stroke-width') || 0;
        
        var totalLen = shapeRaw.getTotalLength();

        var minX = 999999;
        var maxX = 0;
        var minY = 999999;
        var maxY = 0;

        for (var i = 0; i < totalLen; i++) {
          var pt = shapeRaw.getPointAtLength(i);

          minX = Math.min(minX, pt.x);
          maxX = Math.max(maxX, pt.x);
          minY = Math.min(minY, pt.y);
          maxY = Math.max(maxY, pt.y);
        }

        return {
          x: minX - (strokeWidth /2),
          y: minY - (strokeWidth /2),
          width: maxX - minX + (strokeWidth * 1),
          height: maxY - minY + (strokeWidth * 1)
        };
      }
    })
  ;
})();