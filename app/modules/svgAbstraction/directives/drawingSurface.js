(function () {
  angular.module('svgAbstraction.directives')
    .directive('drawingSurface', function ($compile, pathService, uuidService, shapePaths) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          active: '=',
          model: '=',
          whenDone: '&',
          shape: '='
        },
        controller: function($scope){
          resetSelectionBox($scope);
        },
        link: function drawingSurfaceLink($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController;

          var surfaceGroup = drawSurface(ngSvg);

          $compile(surfaceGroup)($scope);

          setupDrawMouseBindings(surfaceGroup, $scope, ngSvg);
        }
      };

      function drawSurface(ngSvg) {
        var drawingSurfaceGroup = ngSvg.svg.group(ngSvg.drawingGroup,{
          'ng-show': 'active'
        });

        // drawSurface
        ngSvg.svg.rect(drawingSurfaceGroup, 0, 0, '100%', '100%', {
          fill: 'white',
          'fill-opacity': 0
        });

        // mouse drag outline
        ngSvg.svg.rect(drawingSurfaceGroup, 0, 0, 0, 0, {
          fill: 'none',
          stroke: '#0096fd',
          strokeWidth: 2,
          'stroke-dasharray': '5,5',
          'ng-attr-x': '{{x}}',
          'ng-attr-y': '{{y}}',
          'ng-attr-width': '{{width}}',
          'ng-attr-height': '{{height}}'
        });

        return angular.element(drawingSurfaceGroup);
      }

      function resetSelectionBox($scope){
        $scope.x = 0;
        $scope.y = 0;
        $scope.width = 0;
        $scope.height = 0;
      }

      function setupDrawMouseBindings(surfaceGroup, $scope, ngSvg) {
        surfaceGroup
          .on('mousedown', startDrag)
          .on('mousemove', dragging)
          .on('mouseup', endDrag)

        var offset,
          start;

        function startDrag(event) {
          offset = surfaceGroup.offset();
          offset.left -= document.documentElement.scrollLeft || document.body.scrollLeft;
          offset.top -= document.documentElement.scrollTop || document.body.scrollTop;

          start = {
            x: event.clientX - offset.left,
            y: event.clientY - offset.top
          };
        }

        /* Provide feedback as we drag */
        function dragging(event) {
          if (!start) {
            return;
          }

          $scope.$apply(function() {
            $scope.x = Math.min(event.clientX - offset.left, start.x);
            $scope.y = Math.min(event.clientY - offset.top, start.y);
            $scope.width = Math.abs(event.clientX - offset.left - start.x);
            $scope.height = Math.abs(event.clientY - offset.top - start.y);
          });
        }

        function endDrag(event) {
          var shape = ngSvg.svg.path(shapePaths.keyValues[$scope.shape]);

          var selectionBox = pathService.getSelectionBox(shape);
          var scaleX = $scope.width / selectionBox.width;
          var scaleY = $scope.height / selectionBox.height;
          var path = pathService.transformShape(ngSvg.svg, shape, scaleX, scaleY, -scaleX * selectionBox.x, -scaleY * selectionBox.y);

          ngSvg.svg.remove(shape);

          var defaultBorder = 2;
          var newShape = {
            id: uuidService.generateUUID(),
            top:  $scope.y,
            left:  $scope.x,
            midPointX: ($scope.width - defaultBorder) / 2,
            midPointY: ($scope.height - defaultBorder) / 2,
            rotation: 0,
            path: path,
            backgroundColor: 'gray',
            borderColor: 'black',
            borderWidth: defaultBorder
          };

          $scope.$apply(function() {
            $scope.model.push(newShape);
            $scope.whenDone({shape: newShape});
            resetSelectionBox($scope);
          });

          start = null;
        }
      }
    }
  );
})();