(function () {

  // remember: services in angular are singletons!
  angular.module('svgShell.services',[]).service('surfaceService', function () {
    var self = this;

    // div containing svg
    self.svgsketch;

    // svg element
    self.svg;

    // rect that 100% fills the svg
    self.surface;

    // HACK - for now...
    self.$scope;

    // nodes on surface
    self.drawNodes = [];

    // the drag information
    // todo: rename it
    self.start;

    // the box that surrounds a selected item
    self.selctionBox;

    self.resetSize = function(width, height) {
      self.svg.configure({
        width: width || self.svgsketch.width(),
        height: height || self.svgsketch.height()
      });
    };

    self.clearSelection = function() {
      if (self.start) {
        return;
      }

      if (!self.selctionBox) {
        return;
      }

      sketchpad.remove(self.selctionBox);
      self.selctionBox = null;

      self.$scope.$apply(function () {
        self.$scope.shape = null;
      });
    };

    self.setupDrawMouseBindings = function() {
      var start,
        outline;

      $(self.surface)
        .on('mousedown', startDrag)
        .on('mousemove', dragging)
        .on('mouseup', endDrag)
        .on('click', self.clearSelection);

      function startDrag(event) {
        // hack?
        if (!self.$scope.isDrawing) {
          return;
        }

        offset = self.svgsketch.offset();

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
        // hack?
        if (!self.$scope.isDrawing) {
          return;
        }

        if (!start) {
          return;
        }

        if (!outline) {
          outline = sketchpad.rect(0, 0, 0, 0, {
            fill: 'none',
            stroke: '#c0c0c0',
            strokeWidth: 1,
            strokeDashArray: '2,2'
          });

          $(outline).mouseup(endDrag);
        }

        sketchpad.change(outline, {
          x: Math.min(event.clientX - offset.left, start.X),
          y: Math.min(event.clientY - offset.top, start.Y),
          width: Math.abs(event.clientX - offset.left - start.X),
          height: Math.abs(event.clientY - offset.top - start.Y)
        });

        event.preventDefault();
      }

      /* Draw where we finish */
      function endDrag(event) {
        // hack?
        if (!self.$scope.isDrawing) {
          return;
        }

        if (!start) {
          return;
        }

        $(outline).remove();
        outline = null;

        var shapeToEdit = drawShape(start.X, start.Y,
          event.clientX - offset.left, event.clientY - offset.top);

        start = null;

        event.preventDefault();
      }

      /* Draw the selected element on the canvas */
      function drawShape(x1, y1, x2, y2) {
        var left = Math.min(x1, x2);
        var top = Math.min(y1, y2);
        var right = Math.max(x1, x2);
        var bottom = Math.max(y1, y2);
        var settings = {
          fill: $('#fill').val(),
          stroke: $('#stroke').val(),
          strokeWidth: $('#swidth').val(),

          //HACK
          id: 'rect'
        };

        var parentGroup = svg.group({
          id: 'parentGroup',
          transform: 'translate(5, 5) rotate(0, 100, 100)'
        });

        var textSpans = sketchpad.createText().string('');

        var text = sketchpad.text(parentGroup, 10, 10, textSpans, {
          id: 'textBlock',
          container: 'rect',
          opacity: 0.7,
          fontFamily: 'Verdana',
          fontSize: '10.0',
          fill: 'blue'
        });

        // hack! Need to pass shape value to service
        var shape = $('#shape').val();
        var node = null;
        if (shape == 'rect') {
          node = sketchpad.rect(parentGroup, left, top, right - left, bottom - top, settings);
        }
        else if (shape == 'circle') {
          var r = Math.min(right - left, bottom - top) / 2;
          node = sketchpad.circle(parentGroup, left + r, top + r, r, settings);
        }
        else if (shape == 'ellipse') {
          var rx = (right - left) / 2;
          var ry = (bottom - top) / 2;
          node = sketchpad.ellipse(parentGroup, left + rx, top + ry, rx, ry, settings);
        }
        else if (shape == 'line') {
          node = sketchpad.line(parentGroup, x1, y1, x2, y2, settings);
        }
        else if (shape == 'polyline') {
          node = sketchpad.polyline(parentGroup, [
            [(x1 + x2) / 2, y1],
            [x2, y2],
            [x1, (y1 + y2) / 2],
            [x2, (y1 + y2) / 2],
            [x1, y2],
            [(x1 + x2) / 2, y1]
          ], $.extend(settings, {fill: 'none'}));
        }
        else if (shape == 'polygon') {
          node = sketchpad.polygon(parentGroup, [
            [(x1 + x2) / 2, y1],
            [x2, y1],
            [x2, y2],
            [(x1 + x2) / 2, y2],
            [x1, (y1 + y2) / 2]
          ], settings);
        }
        self.drawNodes[self.drawNodes.length] = parentGroup;

        $(parentGroup)
          .on('mousedown', startDrag)
          .on('mousemove', dragging)
          .on('mouseup', endDrag)
          .on('click', editShape);

        $('#svgsketch').focus();

        return parentGroup;
      };

      function editShape() {
        if (start) {
          return;
        }

        self.clearSelection();

        var shapeToEdit = this;
        var bb = shapeToEdit.getBBox();

        self.selectionBox = sketchpad.rect(bb.x - 5, bb.y - 5, bb.width + 10, bb.height + 10, {
          fill: 'none',
          stroke: 'black',
          strokeWidth: 1,
          strokeDashArray: '2,2'
        });

        self.$scope.$apply(function () {
          self.$scope.shape = shapeToEdit;
        });

      };


    };
  });
})();