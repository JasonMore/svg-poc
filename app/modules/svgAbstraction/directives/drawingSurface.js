(function () {
  angular.module('svgAbstraction.directives')
    .directive('drawingSurface', function ($compile, pathService, uuidService) {
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

          setupDrawMouseBindings(surfaceGroup, $scope, ngSvg);
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

      function setupDrawMouseBindings(surfaceGroup, $scope, ngSvg) {
        surfaceGroup
          .on('mousedown', startDrag)
          .on('mousemove', dragging)
          .on('mouseup', endDrag)
//          .on('click', selectionService.clearSelection);

        var offset,
          start;

        function startDrag(event) {
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
          var heart = 'M190.95184190571857,18.67034584574202c-22.323836384105082,-25.959966259055825 -59.94907374597721,-24.70023237340574 -83.60038330843584,2.7667085108788574L103.48050782485348,25.934428571291733l-3.870951376425747,-4.497373337497029c-23.651309562458632,-27.466939656241248 -61.27654692433076,-28.726676348847562 -83.60038330843584,-2.7667085108788574c-22.333969029440297,25.936421510213755 -21.2598313123552,69.65041398214339 2.381344245776086,97.11735083142841l85.07985583076164,98.8480189913071l85.07985583076164,-98.8480189913071C212.20154057273854,88.32075982788542 213.28581576713086,44.60676174204332 190.95184190571857,18.67034584574202z';
          var shape = ngSvg.svg.path(heart);

          var selectionBox = pathService.getSelectionBox(shape);
          var scaleX = $scope.width / selectionBox.width;
          var scaleY = $scope.height / selectionBox.height;
          var path = pathService.transformShape(ngSvg.svg, shape, scaleX, scaleY, -scaleX * selectionBox.x, -scaleY * selectionBox.y);

          ngSvg.svg.remove(shape);

          $scope.$apply(function() {
            $scope.model.push({
              id: uuidService.generateUUID(),
              top:  $scope.y,
              left:  $scope.x,
              rotation: 0,
              path: path,
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