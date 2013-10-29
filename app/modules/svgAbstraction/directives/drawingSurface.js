(function () {
  angular.module('svgAbstraction.directives')
    .directive('drawingSurface', function ($compile, pathService, uuidService, shapePaths) {
      return {
        require: '^ngSvg',
        scope: {
          whenDone: '&',
          shape: '='
        },
        controller: function ($scope) {
          resetSelectionBox($scope);
        },
        link: function drawingSurfaceLink($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController;

          setupDrawMouseBindings(element, $scope, ngSvg);
        }
      };

      function resetSelectionBox($scope) {
        $scope.x = 0;
        $scope.y = 0;
        $scope.width = 0;
        $scope.height = 0;
      }

      function setupDrawMouseBindings(surfaceGroup, $scope, ngSvg) {
        surfaceGroup
          .on('mousedown', startDrag)
          .on('mousemove', dragging)
          .on('mouseup', endDrag);

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

          $scope.$apply(function () {
            $scope.x = Math.min(event.clientX - offset.left, start.x);
            $scope.y = Math.min(event.clientY - offset.top, start.y);
            $scope.width = Math.abs(event.clientX - offset.left - start.x);
            $scope.height = Math.abs(event.clientY - offset.top - start.y);
          });
        }

        function endDrag() {
          var shape = ngSvg.svg.path(shapePaths.keyValues[$scope.shape]);

          var selectionBox = pathService.getSelectionBox(shape);
          var scaleX = $scope.width / selectionBox.width;
          var scaleY = $scope.height / selectionBox.height;
          var path = pathService.transformShape(ngSvg.svg, shape, scaleX, scaleY, -scaleX * selectionBox.x, -scaleY * selectionBox.y);

          ngSvg.svg.remove(shape);

          var defaultBorder = 2;
          var newShape = {
            top: $scope.y,
            left: $scope.x,
            width: $scope.width,
            height: $scope.height,
            rotation: 0,
            path: path,
            backgroundColor: 'gray',
            borderColor: 'black',
            borderWidth: defaultBorder,
            "image": {
              "url": null,
              "top": 0,
              "left": 0,
              "width": 0,
              "height": 0,
              "rotation": 0
            }
          };

          $scope.$apply(function () {
            $scope.whenDone({shape: newShape});
            resetSelectionBox($scope);
          });

          start = null;
        }
      }
    }
  );
})();