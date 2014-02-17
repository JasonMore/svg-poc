(function () {
  angular.module('svg-poc').service('pathService', function (svgReferenceService) {

    ///
    // Gets all the points on a path, and calculates the x/y min/max
    ///
    this.getSelectionBox = function getSelectionBox(shape) {
      if(!shape){
        return;
      }
      console.time("getSelectionBox");
      var shapeRaw = shape;

      // check if its an angular shape
//      if (shape.svgElement) {
//        shapeRaw = shape.svgElement.find('.shape')[0];
//      }

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

      console.timeEnd('getSelectionBox');

      return {
        x: minX - (strokeWidth / 2),
        y: minY - (strokeWidth / 2),
        width: maxX - minX + strokeWidth,
        height: maxY - minY + strokeWidth
      };
    };

    this.transformShape = function transformShape(element, scaleX, scaleY, transX, transY) {
      if (typeof(element.instanceRoot) != "undefined") {
        element = element.instanceRoot.correspondingElement;
      }

      // can't resize text
      if (!element.pathSegList) {
        return;
      }

      var newPath = scale(element, scaleX, transX, scaleY, transY);
      return newPath.close().path();

      function round(value) {
        return Math.roundPrecision(value, 3);
      }

      function scale(element, scaleX, transX, scaleY, transY) {
        var newPath = svgReferenceService.svg.createPath();

        // create the new path element
        for (var i = 0; i < element.pathSegList.numberOfItems; i++) {
          var seg = element.pathSegList.getItem(i);

          // Create the new segment, applying the transform matrix
          switch (seg.pathSegType) {
            case 2:
              newPath = newPath.move(
                round(seg.x * scaleX + transX),
                round(seg.y * scaleY + transY)
              );
              break;
            case 3:
              newPath = newPath.move(
                round(seg.x * scaleX),
                round(seg.y * scaleY),
                true
              );
              break;
            case 4:
              newPath = newPath.line(
                round(seg.x * scaleX + transX),
                round(seg.y * scaleY + transY)
              );
              break;
            case 5:
              newPath = newPath.line(
                round(seg.x * scaleX),
                round(seg.y * scaleY),
                true
              );
              break;
            case 6:
              newPath = newPath.curveC(
                round(seg.x1 * scaleX + transX),
                round(seg.y1 * scaleY + transY),
                round(seg.x2 * scaleX + transX),
                round(seg.y2 * scaleY + transY),
                round(seg.x * scaleX + transX),
                round(seg.y * scaleY + transY)
              );
              break;
            case 7:
              newPath = newPath.curveC(
                round(seg.x1 * scaleX),
                round(seg.y1 * scaleY),
                round(seg.x2 * scaleX),
                round(seg.y2 * scaleY),
                round(seg.x * scaleX),
                round(seg.y * scaleY),
                true
              );
              break;
            case 8:
              newPath = newPath.curveQ(
                round(seg.x1 * scaleX + transX),
                round(seg.y1 * scaleY + transY),
                round(seg.x * scaleX + transX),
                round(seg.y * scaleY + transY)
              );
              break;
            case 9:
              newPath = newPath.curveQ(
                round(seg.x1 * scaleX),
                round(seg.y1 * scaleY),
                round(seg.x * scaleX),
                round(seg.y * scaleY),
                true
              );
              break;
            case 10:
              newPath = newPath.arc(
                round(scaleX * seg.r1 + transX),
                round(scaleY * seg.r2 + transY),
                round(seg.angle),
                round(seg.largeArcFlag),
                round(seg.sweepFlag),
                round(scaleX * seg.x + transX),
                round(scaleY * seg.y + transY)
              );
              break;
            case 11:
              newPath = newPath.arc(
                round(scaleX * seg.r1),
                round(scaleY * seg.r2),
                round(seg.angle),
                round(seg.largeArcFlag),
                round(seg.sweepFlag),
                round(scaleX * seg.x),
                round(scaleY * seg.y),
                true
              );
              break
            case 12:
              newPath = newPath.horiz(
                round(scaleX * seg.x + transX)
              );
              break;
            case 13:
              newPath = newPath.horiz(
                round(scaleX * seg.x),
                true
              );
              break;
            case 14:
              newPath = newPath.vert(
                round(scaleX * seg.y + transY)
              );
              break;
            case 15:
              newPath = newPath.vert(
                round(scaleX * seg.y),
                true
              );
              break;
            case 16:
              newPath = newPath.smoothC(
                round(seg.x2 * scaleX),
                round(seg.y2 * scaleY),
                round(seg.x * scaleX),
                round(seg.y * scaleY),
                false
              );
              break;
            case 17:
              newPath = newPath.smoothC(
                round(seg.x2 * scaleX),
                round(seg.y2 * scaleY),
                round(seg.x * scaleX),
                round(seg.y * scaleY),
                true
              );
              break;
            case 18:
              newPath = newPath.smoothQ(
                round(seg.x * scaleX + transX),
                round(seg.y * scaleY + transY)
              );
              break;
            case 19:
              newPath = newPath.smoothQ(
                round(seg.x * scaleX),
                round(seg.y * scaleY),
                true
              );
              break;
          }
        }
        return newPath;
      }
    };


  });
})();