(function () {
  angular.module('svgAbstraction.directives')
    .directive('drawingSurface', function ($compile) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          show: '=',
          model: '='
        },
        controller: function($scope){
          $scope.x = 0;
          $scope.y = 0;
          $scope.width = 0;
          $scope.height = 0;
        },
        link: function drawingSurfaceLink($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController;

          var surfaceGroup = drawSurface(ngSvg);

          $compile(surfaceGroup)($scope);

          setupDrawMouseBindings(surfaceGroup, $scope);
        }
      };

      function drawSurface(ngSvg) {
        var drawingSurfaceGroup = ngSvg.svg.group(ngSvg.drawingGroup);

        // drawSurface
        ngSvg.svg.rect(drawingSurfaceGroup, 0, 0, '100%', '100%', {
//          id: 'surface',
          fill: 'white',
          'fill-opacity': 0
//          stroke: 'black'
//          'stroke-width': 4
        });

        // mouse drag outline
        ngSvg.svg.rect(drawingSurfaceGroup, 0, 0, 0, 0, {
          fill: 'none',
          stroke: 'blue',
          strokeWidth: 1,
          strokeDashArray: '2,2',
          'ng-attr-x': '{{x}}',
          'ng-attr-y': '{{y}}',
          'ng-attr-width': '{{width}}',
          'ng-attr-height': '{{height}}'
        });


        return angular.element(drawingSurfaceGroup);
      }

      function setupDrawMouseBindings(surfaceGroup, $scope) {
        surfaceGroup
          .on('mousedown', startDrag)
          .on('mousemove', dragging)
          .on('mouseup', endDrag)
//          .on('click', selectionService.clearSelection);

        var offset,
          start;

        function startDrag(event) {
//        if (!self.isDrawing()) {
//          return;
//        }

          offset = surfaceGroup.offset();
//
          offset.left -= document.documentElement.scrollLeft || document.body.scrollLeft;
          offset.top -= document.documentElement.scrollTop || document.body.scrollTop;

          start = {
            x: event.clientX - offset.left,
            y: event.clientY - offset.top
          };

          event.preventDefault();
        }

        /* Provide feedback as we drag */
        function dragging(event) {
//          if (!self.isDrawing()) {
//            return;
//          }

          if (!start) {
            return;
          }

          $scope.$apply(function() {
            $scope.x = Math.min(event.clientX - offset.left, start.x);
            $scope.y = Math.min(event.clientY - offset.top, start.y);
            $scope.width = Math.abs(event.clientX - offset.left - start.x);
            $scope.height = Math.abs(event.clientY - offset.top - start.y);
          });


          event.preventDefault();
        }

        function endDrag(event) {
//          if (!self.isDrawing()) {
//            return;
//          }
//
//          if (!start) {
//            return;
//          }

//          $(outline).remove();
//          outline = null;

//          var shapeGroup = drawShape({
//            startX: start.X,
//            startY: start.Y,
//            endX: event.clientX - offset.left,
//            endY: event.clientY - offset.top
//          });
//
//          self.shapesOnScreen[self.shapesOnScreen.length] = shapeGroup;

//          $(shapeGroup)
//            .on('mousedown', startDrag)
//            .on('mousemove', dragging)
//            .on('mouseup', endDrag)
//            .on('click', function () {
//              editShape(shapeGroup);
//            });

          $scope.$apply(function() {
            $scope.model.push({
              top:  $scope.x,
              left:  $scope.y,
              rotation: 0,
              path: 'M0,0L50,0L50,50L0,50z',
              backgroundColor: 'gray',
              borderColor: 'black',
              borderWidth: '2'
            });
          });

          start = null;
//
//          editShape(shapeGroup);

          event.preventDefault();
        }
      }

    }
  );
})();