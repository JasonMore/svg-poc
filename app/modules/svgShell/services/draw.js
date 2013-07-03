(function () {
  angular.module('svgShell.services').service('drawService', function (surfaceService, selectionService, dragService) {
    var self = this;

    // external hooks wired up elsewhere
    self.isDrawing;

    // nodes on surface
    self.drawNodes = [];

    // draw settings, set by controller (for now)
    self.drawSettings = {
      shape: '',
      fill: '',
      stroke: '',
      strokeWidth: ''
    };

    self.setupDrawMouseBindings = function () {
      var start,
        outline;

      $(surfaceService.surface)
        .on('mousedown', startDrag)
        .on('mousemove', dragging)
        .on('mouseup', endDrag)
        .on('click', selectionService.clearSelection);

      function startDrag(event) {
        if (!self.isDrawing()) {
          return;
        }

        offset = surfaceService.svgsketch.offset();

        offset.left -= document.documentElement.scrollLeft || document.body.scrollLeft;
        offset.top -= document.documentElement.scrollTop || document.body.scrollTop;

        start = {
          X: event.clientX - offset.left,
          Y: event.clientY - offset.top
        };

        event.preventDefault();
      }

      /* Provide feedback as we drag */
      function dragging(event) {
        if (!self.isDrawing()) {
          return;
        }

        if (!start) {
          return;
        }

        if (!outline) {
          outline = surfaceService.svg.rect(0, 0, 0, 0, {
            fill: 'none',
            stroke: '#c0c0c0',
            strokeWidth: 1,
            strokeDashArray: '2,2'
          });

          $(outline).mouseup(endDrag);
        }

        $(outline).attr({
          x: Math.min(event.clientX - offset.left, start.X),
          y: Math.min(event.clientY - offset.top, start.Y),
          width: Math.abs(event.clientX - offset.left - start.X),
          height: Math.abs(event.clientY - offset.top - start.Y)
        });

        event.preventDefault();
      }

      /* Draw where we finish */
      function endDrag(event) {
        if (!self.isDrawing()) {
          return;
        }

        if (!start) {
          return;
        }

        $(outline).remove();
        outline = null;

        var shapeGroup = drawShape({
          startX: start.X,
          startY: start.Y,
          endX: event.clientX - offset.left,
          endY: event.clientY - offset.top
        });

        self.drawNodes[self.drawNodes.length] = shapeGroup;

        $(shapeGroup)
          .on('mousedown', startDrag)
          .on('mousemove', dragging)
          .on('mouseup', endDrag)
          .on('click', editShape);

//        dragService.makeDraggable(shapeGroup);

        start = null;

        event.preventDefault();
      }

      /* Draw the selected element on the canvas */
      function drawShape(createShape) {

        var left = Math.min(createShape.startX, createShape.endX);
        var top = Math.min(createShape.startY, createShape.endY);
        var right = Math.max(createShape.startX, createShape.endX);
        var bottom = Math.max(createShape.startY, createShape.endY);
        var width = right - left;
        var height = bottom - top;

        var settings = _.extend({
          class: 'shape'
        }, self.drawSettings);

        var parentGroup = surfaceService.svg.group({
          transform: 'translate(' + left + ',' + top + ')'
        });

        if (settings.shape == 'rect') {
          surfaceService.svg.path(parentGroup, surfaceService.svg.createPath()
            .move(0, 0)
            .line(width, 0)
            .line(width, height)
            .line(0, height)
            .close(), settings);
        }
        else if (settings.shape == 'circle') {
          surfaceService.svg.path(parentGroup, surfaceService.svg.createPath()
            .move(width / 2, 0)
            .arc(
              /*rx*/ width / 2,
              /*ry*/ height / 2,
              /*xRotate*/ 0,
              /*large*/ 1,
              /*clockwise*/ 0,
              /*x*/ 0,
              /*y*/ height,
              /*relative*/ true)
            .arc(
              /*rx*/ width / 2,
              /*ry*/ height / 2,
              /*xRotate*/ 0,
              /*large*/ 1,
              /*clockwise*/ 0,
              /*x*/ 0,
              /*y*/ (height * -1),
              /*relative*/ true)
            .close(), settings);

        }
//        else if (settings.shape == 'ellipse') {
//          var rx = (right - left) / 2;
//          var ry = (bottom - top) / 2;
//          node = surfaceService.svg.ellipse(parentGroup, left + rx, top + ry, rx, ry, settings);
//        }
//        else if (settings.shape == 'line') {
//          node = surfaceService.svg.line(parentGroup, x1, y1, x2, y2, settings);
//        }
//        else if (settings.shape == 'polyline') {
//          node = surfaceService.svg.polyline(parentGroup, [
//            [(x1 + x2) / 2, y1],
//            [x2, y2],
//            [x1, (y1 + y2) / 2],
//            [x2, (y1 + y2) / 2],
//            [x1, y2],
//            [(x1 + x2) / 2, y1]
//          ], $.extend(settings, {fill: 'none'}));
//        }
//        else if (settings.shape == 'polygon') {
//          node = surfaceService.svg.polygon(parentGroup, [
//            [(x1 + x2) / 2, y1],
//            [x2, y1],
//            [x2, y2],
//            [(x1 + x2) / 2, y2],
//            [x1, (y1 + y2) / 2]
//          ], settings);
//        }

        var textSpans = surfaceService.svg.createText().string('');

        var text = surfaceService.svg.text(parentGroup, 10, 10, textSpans, {
          class: 'text',
          opacity: 0.7,
          fontFamily: 'Verdana',
          fontSize: '10.0',
          fill: 'blue'
        });

        return parentGroup;
      };

      function editShape() {
        if (start) {
          return;
        }

        selectionService.clearSelection();

        // "this" is the shape that was clicked
        selectionService.createSelectionBox(this);
        surfaceService.setShapeToEdit(this);
      };

    };

    self.updateShape = function (shape) {
      var shape = $(shape).find('.shape');
      shape.attr(self.drawSettings);
    };

  });
})();