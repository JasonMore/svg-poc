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
        },
        link: function ($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController,
            selectionBox = createSelectionBox($scope, ngSvg);

          $compile(selectionBox)($scope);

          $scope.calcLeft = function(shape){
            return shape ? shape.left - shape.borderWidth / 2 : 0;
          };

          $scope.calcTop = function(shape) {
            return shape ? shape.top - shape.borderWidth / 2 : 0;
          }

          $scope.$watch('shape', function(shape, oldVal) {
            if(shape === oldVal) {
              return;
            }

            var selectionBox = ngSvg.getSelectionBox(shape);
            $scope.width = selectionBox.width;
            $scope.height = selectionBox.height;
          });
         }
      };

      function createSelectionBox(scope, ngSvg) {
        var transform = 'translate({{calcLeft(shape)}},{{calcTop(shape)}}), rotate(0,{{shape.middleX}},{{shape.middleY}})';
        var selectionBox = ngSvg.svg.group(ngSvg.selectionGroup,{
          transform: transform
//          origRect: JSON.stringify(boundingBox),
//          rect1: JSON.stringify(boundingBox),
//          transform: transformStr
        });

        ngSvg.svg.path(selectionBox, '', {
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
    })
  ;
})();