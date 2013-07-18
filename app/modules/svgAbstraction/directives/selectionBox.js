(function () {
  angular.module('svgAbstraction.directives')
    .directive('selectionBox', function ($compile) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          shape: '='
        },
        controller: function ($scope) {
          $scope.width = 0;
          $scope.height = 0;
          $scope.left = 0;
          $scope.top = 0;
          $scope.midPointX = 0;
          $scope.midPointY = 0;

          $scope.$watch('shape', function(shape, oldVal) {
            if(shape === oldVal) {
              return;
            }

            var selectionBox = getSelectionBox(shape);
            $scope.top = shape.top;
            $scope.left = shape.left;
            $scope.width = selectionBox.width;
            $scope.height = selectionBox.height;
          });
        },
        link: function (scope, element, attr, ngSvgController) {

          var selectionBox = createSelectionBox(scope, ngSvgController.svg);

          $compile(selectionBox)(scope);


//          if (scope.shape) {
//            var parentGroup = scope.shape.svgElement;
//          }
//
//          var shape = parentGroup.find('.shape');
//          var selectionBox = getSelectionBox(shape);


        }
      };

      function createSelectionBox(scope, svg) {
        var transform = 'translate({{left}},{{top}}), rotate(0,{{midPointX}},{{midPointY}})';
        var selectionBox = svg.group({
          transform: transform
//          origRect: JSON.stringify(boundingBox),
//          rect1: JSON.stringify(boundingBox),
//          transform: transformStr
        });

        svg.path(selectionBox, '', {
//          id: 'outlinePath',
          'ng-attr-d': 'M0,0L{{width}},0L{{width}},{{height}}L0,{{height}}z',
          fill: 'none',
//          fill: 'white',
          fillOpacity: '0.3',
          'stroke-dasharray': '5,5',
          stroke: '#D90000',
          strokeWidth: 2,
          class: 'draggable'
        });

        return selectionBox;
      }

      function getSelectionBox(shape) {

        var shapeRaw = $(shape.svgElement).find('.shape')[0];
        var totalLen = shapeRaw.getTotalLength();

        var minX = 999999;
        var maxX = 0;
        var minY = 999999;
        var maxY = 0;

        for (var i = 0; i < totalLen; i++) {
          var pt = shapeRaw.getPointAtLength(i);

          minX = Math.min(minX, pt.x);
          maxX = Math.max(maxX, pt.x);
          minY = Math.min(minY, pt.y);
          maxY = Math.max(maxY, pt.y);
        }

        // TODO: Look at this for refactor. Why do we need a Rect ?
//        var boundingBox = shapeRaw.ownerSVGElement.createSVGRect();
//
//        boundingBox.x = minX;
//        boundingBox.y = minY;
//        boundingBox.width = maxX - minX;
//        boundingBox.height = maxY - minY;
//        return boundingBox;

        return {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        };
      }
    })
  ;
})();