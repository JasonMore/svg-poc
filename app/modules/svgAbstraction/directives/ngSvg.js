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

        self.shapeGroup = svg.group();
        self.selectionGroup = svg.group();
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

        // TODO: Look at this for refactor. Why do we need a Rect ?
//        var boundingBox = shapeRaw.ownerSVGElement.createSVGRect();
//
//        boundingBox.x = minX;
//        boundingBox.y = minY;
//        boundingBox.width = maxX - minX;
//        boundingBox.height = maxY - minY;
//        return boundingBox;

        return {
          x: minX - strokeWidth,
          y: minY - strokeWidth,
          width: maxX - minX + (strokeWidth * 2),
          height: maxY - minY + (strokeWidth * 2)
        };
      }
    })
  ;
})();