(function () {
  angular.module('svgShell')
    .controller('svgShellCtrl', function ($scope, textFlowService) {
      window.debugScope = $scope;

      var svg;

      var drawNodes = [];
      var sketchpad = null;
      var start = null;
      var outline = null;
      var offset = null;
      var box = null;
      var shape = null;
      var parentGroup = null;
      var textSpans;
      var text;

      $scope.isDrawing = true;
      $scope.$watch('isDrawing', function (val) {
        clearSelection();
      });

      $scope.textValue = '';

      $scope.$watch('textValue', function(val){
        if(!val) {
          return;
        }

        // bring to front
        $(text.parentElement).append( text );

        text.firstChild.nodeValue = val;
        setText();
      });

      $scope.$on('$viewContentLoaded', function () {

        $('#svgsketch').svg({onLoad: function (svg) {
          sketchpad = svg;
          var surface = svg.rect(0, 0, '100%', '100%', {id: 'surface', fill: 'white'});
          resetSize(svg, '100%', '100%');

          //HACKs below
          parentGroup = svg.group({
            id: 'parentGroup',
            transform: 'translate(5, 5) rotate(0, 100, 100)'
          });

          textSpans = sketchpad.createText().string('');

          text = sketchpad.text(parentGroup, 10, 10, textSpans, {
            id: 'textBlock',
            container: 'rect',
            opacity: 0.7,
            fontFamily: 'Verdana',
            fontSize: '10.0',
            fill: 'blue'
          });

        }});

        $(surface)
          .on('mousedown', startDrag)
          .on('mousemove', dragging)
          .on('mouseup', endDrag)
          .on('click', clearSelection);

        /* Remove the last drawn element */
        $('#undo').click(function () {
          if (!drawNodes.length) {
            return;
          }
          sketchpad.remove(drawNodes[drawNodes.length - 1]);
          drawNodes.splice(drawNodes.length - 1, 1);
        });

        /* Clear the canvas */
        $('#clear2').click(function () {
          while (drawNodes.length) {
            $('#undo').trigger('click');
          }
        });

        /* Convert to text */
        $('#toSVG').click(function () {
          alert(sketchpad.toSVG());
        });

      });

      /* Remember where we started */
      function startDrag(event) {
        // hack?
        if (!$scope.isDrawing) {
          return;
        }

        offset = $('#svgsketch').offset();

        offset.left -= document.documentElement.scrollLeft || document.body.scrollLeft;
        offset.top -= document.documentElement.scrollTop || document.body.scrollTop;

        start = {X: event.clientX - offset.left, Y: event.clientY - offset.top};
        event.preventDefault();
      }

      /* Provide feedback as we drag */
      function dragging(event) {
        // hack?
        if (!$scope.isDrawing) {
          return;
        }

        if (!start) {
          return;
        }
        if (!outline) {
          outline = sketchpad.rect(0, 0, 0, 0,
            {fill: 'none', stroke: '#c0c0c0', strokeWidth: 1, strokeDashArray: '2,2'});
          $(outline).mouseup(endDrag);
        }
        sketchpad.change(outline, {x: Math.min(event.clientX - offset.left, start.X),
          y: Math.min(event.clientY - offset.top, start.Y),
          width: Math.abs(event.clientX - offset.left - start.X),
          height: Math.abs(event.clientY - offset.top - start.Y)});
        event.preventDefault();
      }

      /* Draw where we finish */
      function endDrag(event) {
        // hack?
        if (!$scope.isDrawing) {
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

        var shape = $('#shape').val();
        var node = null;
        if (shape == 'rect') {

          //HACK
          node = sketchpad.rect(parentGroup, left, top, right - left, bottom - top, settings);

//          node = sketchpad.rect(left, top, right - left, bottom - top, settings);
        }
        else if (shape == 'circle') {
          var r = Math.min(right - left, bottom - top) / 2;
          node = sketchpad.circle(left + r, top + r, r, settings);
        }
        else if (shape == 'ellipse') {
          var rx = (right - left) / 2;
          var ry = (bottom - top) / 2;
          node = sketchpad.ellipse(left + rx, top + ry, rx, ry, settings);
        }
        else if (shape == 'line') {
          node = sketchpad.line(x1, y1, x2, y2, settings);
        }
        else if (shape == 'polyline') {
          node = sketchpad.polyline([
            [(x1 + x2) / 2, y1],
            [x2, y2],
            [x1, (y1 + y2) / 2],
            [x2, (y1 + y2) / 2],
            [x1, y2],
            [(x1 + x2) / 2, y1]
          ], $.extend(settings, {fill: 'none'}));
        }
        else if (shape == 'polygon') {
          node = sketchpad.polygon([
            [(x1 + x2) / 2, y1],
            [x2, y1],
            [x2, y2],
            [(x1 + x2) / 2, y2],
            [x1, (y1 + y2) / 2]
          ], settings);
        }
        drawNodes[drawNodes.length] = node;

        $(node)
          .on('mousedown', startDrag)
          .on('mousemove', dragging)
          .on('mouseup', endDrag)
          .on('click', editShape);

        $('#svgsketch').focus();

        return node;
      };

      function resetSize(svg, width, height) {
        svg.configure({width: width || $(svg._container).width(),
          height: height || $(svg._container).height()});
      };

      function editShape() {
        if (start) {
          return;
        }

        clearSelection();

        var shapeToEdit = this;
        var bb = shapeToEdit.getBBox();

        box = sketchpad.rect(bb.x - 5, bb.y - 5, bb.width + 10, bb.height + 10, {
          fill: 'none',
          stroke: 'black',
          strokeWidth: 1,
          strokeDashArray: '2,2'
        });

        $scope.$apply(function () {
          $scope.shape = shapeToEdit;
        });

      };

      function clearSelection() {
        if (start) {
          return;
        }

        if (!box) {
          return;
        }

        sketchpad.remove(box);
        box = null;

        $scope.$apply(function () {
          $scope.shape = null;
        });
      }

      function setText(){
        // HACK



        textFlowService.recalcText(sketchpad, text);
      }
    })
  ;

})();