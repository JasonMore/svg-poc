(function () {
  angular.module('svgAbstraction.services').service('pathService', function () {

    ///
    // Gets all the points on a path, and calculates the x/y min/max
    ///
    this.getSelectionBox = function (shape) {
      var shapeRaw = shape;

      // check if its an angular shape
      if (shape.svgElement) {
        shapeRaw = shape.svgElement.find('.shape')[0];
      }

      var strokeWidth = Number($(shapeRaw).attr('stroke-width')) || 0;

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
        x: minX - (strokeWidth / 2),
        y: minY - (strokeWidth / 2),
        width: maxX - minX + strokeWidth,
        height: maxY - minY + strokeWidth
      };
    }
  });
})();