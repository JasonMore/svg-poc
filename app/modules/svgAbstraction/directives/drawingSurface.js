(function () {
  angular.module('svgAbstraction.directives')
    .directive('drawingSurface', function ($compile, pathService, uuidService, $timeout) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          active: '=',
          model: '=',
          whenDone: '&'
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

          setupDrawMouseBindings(surfaceGroup, $scope, ngSvg);
        }
      };

      function drawSurface(ngSvg) {
        var drawingSurfaceGroup = ngSvg.svg.group(ngSvg.drawingGroup,{
          'ng-show': 'active'
        });

        // drawSurface
        ngSvg.svg.rect(drawingSurfaceGroup, 0, 0, '100%', '100%', {
//          id: 'surface',
          fill: 'white',
          'fill-opacity': 0,
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

          event.preventDefault();
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

          event.preventDefault();
        }

        function endDrag(event) {
          var heart = 'M15.985,5.972c-7.563,0-13.695,4.077-13.695,9.106c0,2.877,2.013,5.44,5.147,7.108c-0.446,1.479-1.336,3.117-3.056,4.566c0,0,4.015-0.266,6.851-3.143c0.163,0.04,0.332,0.07,0.497,0.107c-0.155-0.462-0.246-0.943-0.246-1.443c0-3.393,3.776-6.05,8.599-6.05c3.464,0,6.379,1.376,7.751,3.406c1.168-1.34,1.847-2.892,1.847-4.552C29.68,10.049,23.548,5.972,15.985,5.972zM27.68,22.274c0-2.79-3.401-5.053-7.599-5.053c-4.196,0-7.599,2.263-7.599,5.053c0,2.791,3.403,5.053,7.599,5.053c0.929,0,1.814-0.116,2.637-0.319c1.573,1.597,3.801,1.744,3.801,1.744c-0.954-0.804-1.447-1.713-1.695-2.534C26.562,25.293,27.68,23.871,27.68,22.274z';
          var shape = ngSvg.svg.path(heart);

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
          });

          start = null;

          event.preventDefault();
        }
      }
    }
  );
})();