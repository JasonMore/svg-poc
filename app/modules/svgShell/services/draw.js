(function () {
  angular.module('svgShell.services').service('drawService', function (surfaceService, selectionService, resizeService) {
    var self = this;

    var start,
      outline;

    // external hooks wired up elsewhere
    self.isDrawing;
    self.shapeToDraw;
    self.setShapeToEdit;

    // nodes on surface
    self.shapesOnScreen = [];

    self.setupDrawMouseBindings = function () {
      $(surfaceService.surface)
        .on('mousedown', startDrag)
        .on('mousemove', dragging)
        .on('mouseup', endDrag)
        .on('click', selectionService.clearSelection);
    };

    self.exportShapes = function () {
      var exportShapes = [];
      _.forEach(self.shapesOnScreen, function (shapeGroup) {
        var group = $(shapeGroup);
        var shape = group.find('.shape');
        var text = group.find('.text');

        exportShapes.push({
          id: group.data('shapeId'),
          transform: group.attr('transform'),
          translationOffset: group.data('translationOffset'),
          shape: {
            path: shape.attr('d'),
            fill: shape.attr('fill'),
            stroke: shape.attr('stroke'),
            'stroke-width': shape.attr('stroke-width')
          },
          text: {
            value: text.text(),
            fill: text.attr('fill'),
            'font-family': text.attr('font-family'),
            'font-size': text.attr('font-size'),
          }
        });
      });

      return JSON.stringify(exportShapes);
    };

    self.importTemplate = function (template, data) {
      var importShapes = JSON.parse(template),
        overrides;

      if (data) {
        try {
          var overrides = JSON.parse(data);
        } catch (e) {
          console.error(e); //error in the above string(in this case,yes)!
        }
      }

      _.forEach(importShapes, function (importShapeGroup) {
        var override = _.find(overrides, function (shape) {
          return importShapeGroup.id === shape.id;
        });

        if(override){
          if (override.shape) {
            _.extend(importShapeGroup.shape, override.shape);
          }

          if (override.text) {
            _.extend(importShapeGroup.text, override.text);
          }
        }

        importShapeGroup.shape.class = 'shape';
        importShapeGroup.text.class = 'text';

        var parentGroup = surfaceService.svg.group({
          transform: importShapeGroup.transform
        });

        $(parentGroup).data('translationOffset', importShapeGroup.translationOffset);

        surfaceService.svg.path(parentGroup, importShapeGroup.shape.path, importShapeGroup.shape);

        var textSpans = surfaceService.svg.createText().string(importShapeGroup.text.value);

        surfaceService.svg.text(parentGroup, 10, 10, textSpans, importShapeGroup.text);

        self.shapesOnScreen[self.shapesOnScreen.length] = parentGroup;

        $(parentGroup)
          .on('mousedown', startDrag)
          .on('mousemove', dragging)
          .on('mouseup', endDrag)
          .on('click', function () {
            editShape(parentGroup);
          });

      });
    };

    self.deleteShape = function (shape) {
      surfaceService.svg.remove(shape);
      self.shapesOnScreen.remove(shape);
    };

    self.clearScreen = function () {
      _.forEach(self.shapesOnScreen, function (shape) {
        surfaceService.svg.remove(shape);
      });

      self.shapesOnScreen = [];
    };

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

      self.shapesOnScreen[self.shapesOnScreen.length] = shapeGroup;

      $(shapeGroup)
        .on('mousedown', startDrag)
        .on('mousemove', dragging)
        .on('mouseup', endDrag)
        .on('click', function () {
          editShape(shapeGroup);
        });

      start = null;

      editShape(shapeGroup);

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
      var halfWidth = width / 2;
      var halfHeight = height / 2;

      var settings = {
        class: 'shape',
        fill: 'gray',
        stroke: 'black',
        'stroke-width': 2
      };

      var transform = 'translate(${left},${top}), rotate(0,${halfWidth},${halfHeight})';

      var parentGroup = surfaceService.svg.group({
        transform: _.template(transform, {
          left: left,
          top: top,
          halfWidth: halfWidth,
          halfHeight: halfHeight
        })
      });

      $(parentGroup).data('translationOffset', {top: top, left: left});

      // hack for templating
      $(parentGroup).data('shapeId', 'shape' + self.shapesOnScreen.length);

      if (self.shapeToDraw() == 'rect') {
        surfaceService.svg.path(parentGroup, surfaceService.svg.createPath()
          .move(0, 0)
          .line(width, 0)
          .line(width, height)
          .line(0, height)
          .close(), settings);
      }
      else if (self.shapeToDraw() == 'circle') {
        surfaceService.svg.path(parentGroup, surfaceService.svg.createPath()
          .move(halfWidth, 0)
          .arc(
            /*rx*/ halfWidth,
            /*ry*/ halfHeight,
            /*xRotate*/ 0,
            /*large*/ 1,
            /*clockwise*/ 0,
            /*x*/ 0,
            /*y*/ height,
            /*relative*/ true)
          .arc(
            /*rx*/ halfWidth,
            /*ry*/ halfHeight,
            /*xRotate*/ 0,
            /*large*/ 1,
            /*clockwise*/ 0,
            /*x*/ 0,
            /*y*/ (height * -1),
            /*relative*/ true)
          .close(), settings);

      }
      else if (self.shapeToDraw() == 'heart') {

   //       var heart = 'M224.455832623421,50.7026488717678 C203.965351632301,36.6768858749254,169.430111824198,37.3575025744142,147.72116600199,52.1974586786422L,144.168117604357,54.6273231843932 Z';
        var heart = 'M24.132,7.971c-2.203-2.205-5.916-2.098-8.25,0.235L15.5,8.588l-0.382-0.382c-2.334-2.333-6.047-2.44-8.25-0.235c-2.204,2.203-2.098,5.916,0.235,8.249l8.396,8.396l8.396-8.396C26.229,13.887,26.336,10.174,24.132,7.971z';
   //       var heart = 'M 379.14286,136.36218 C 599.14285,-120.78067 819.14286,159.21932 696.28571,304.93361 L 379.14286,627.79075 M 379.14285,136.36218 C 159.14286,-120.78067 -60.857149,159.21932 62.000001,304.93361 L 379.14285,627.79075';
          var shape = surfaceService.svg.path(parentGroup, heart, settings);

          // get the bounding box of this shape
          var bbox = selectionService.getSelectionBox(shape);

          var scaleX = width /  bbox.width;
          var scaleY = height /  bbox.height;

          resizeService.transformShape(shape, scaleX, scaleY, -scaleX * bbox.x, -scaleY*bbox.y);
      }

      var textSpans = surfaceService.svg.createText().string('');

      surfaceService.svg.text(parentGroup, 10, 10, textSpans, {
        class: 'text',
        opacity: 1,
        'font-family': 'Verdana',
        'font-size': '14.0',
        fill: 'black'
      });

      return parentGroup;
    }

    function editShape(shape) {
      if (start) {
        return;
      }

      selectionService.clearSelection();

      // "this" is the shape that was clicked
      selectionService.createSelectionBox(shape);
      self.setShapeToEdit(shape);
    }

  });
})();