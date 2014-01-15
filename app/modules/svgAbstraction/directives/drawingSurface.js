(function () {
  angular.module('svgAbstraction.directives')
    .directive('drawingSurface', function ($compile, pathService, uuidService, shapePaths, svgReferenceService) {

      // since svgReferenceService.svg is null initially, this helper method
      // lets me have a local var svg I can call
      var svg = function() {
        return svgReferenceService.svg;
      };

      return {
        scope: {
          shapeToDraw: '=shape'
        },
        controller: function ($scope) {
          resetSelectionBox($scope);
        },
        link: function drawingSurfaceLink($scope, element, attr) {
          setupDrawMouseBindings(element, $scope);
        }
      };

      function resetSelectionBox($scope) {
        $scope.$parent.x = 0;
        $scope.$parent.y = 0;
        $scope.$parent.width = 0;
        $scope.$parent.height = 0;
      }

      function setupDrawMouseBindings(surfaceGroup, $scope) {
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
            $scope.$parent.x = Math.min(event.clientX - offset.left, start.x);
            $scope.$parent.y = Math.min(event.clientY - offset.top, start.y);
            $scope.$parent.width = Math.abs(event.clientX - offset.left - start.x);
            $scope.$parent.height = Math.abs(event.clientY - offset.top - start.y);
          });
        }

        function endDrag() {
          var shape = svg().path(shapePaths.keyValues[$scope.shapeToDraw.key]);

          var selectionBox = pathService.getSelectionBox(shape);
          var scaleX = $scope.$parent.width / selectionBox.width;
          var scaleY = $scope.$parent.height / selectionBox.height;
          var path = pathService.transformShape(shape, scaleX, scaleY, -scaleX * selectionBox.x, -scaleY * selectionBox.y);

          svg().remove(shape);

          var defaultBorder = 2;
          var newShape = {
            top: $scope.$parent.y,
            left: $scope.$parent.x,
            width: $scope.$parent.width,
            height: $scope.$parent.height,
            rotation: 0,
            path: path,
            backgroundColor: 'rgba(53,99,204,1)',
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
            $scope.$emit('shapeDrawn', newShape);
            resetSelectionBox($scope);
          });

          start = null;
        }
      }
    }
  );
})();