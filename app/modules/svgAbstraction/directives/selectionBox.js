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
          addScopeMethods($scope, ngSvg);
        }
      };

      function addScopeMethods($scope, ngSvg) {
        $scope.calcLeft = function (shape) {
          return shape ? shape.left - shape.borderWidth / 2 : 0;
        };

        $scope.calcTop = function (shape) {
          return shape ? shape.top - shape.borderWidth / 2 : 0;
        };

        $scope.$watch('shape', function (shape, oldVal) {
          if (shape === oldVal) {
            return;
          }

          var selectionBox = ngSvg.getSelectionBox(shape);
          $scope.width = selectionBox.width;
          $scope.height = selectionBox.height;
        });
      }

      function createSelectionBox(scope, ngSvg) {
        var selectionBox = drawSelectionBox(ngSvg);
        drawSelectionCorners(ngSvg, selectionBox);
        return selectionBox;
      }

      function drawSelectionBox(ngSvg) {
        var transform = 'translate({{calcLeft(shape)}},{{calcTop(shape)}}), rotate(0,{{shape.middleX}},{{shape.middleY}})';
        var selectionBox = ngSvg.svg.group(ngSvg.selectionGroup, {
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

      function drawSelectionCorners(ngSvg, selectionBox) {
        var defaultCircleSettings = {
          class_: 'resizable',
          fill: '#D90000',
          'stroke-width': 1,
          stroke: 'white'
        };

        var cornerNW = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id: 'cornerNW',
          transform: 'translate(0,0)'
        }));

        var cornerNE = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id: 'cornerNE',
          transform: 'translate({{width}},0)'
        }));

        var cornerSE = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id: 'cornerSE',
          transform: 'translate({{width}},{{height}})'
        }));

        var cornerSW = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id: 'cornerSW',
          transform: 'translate(0,{{height}})'
        }));

        ngSvg.svg.line(selectionBox, 0, 0, 0, -20, {
          id: 'rotatorLine',
          stroke: '#D90000',
          strokeWidth: 3,
          transform: 'translate({{shape.middleX}},0)'
        });

        var rotator = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id: 'rotator',
          fill: '#FFFFFF',
          stroke: '#D90000',
          strokeWidth: 1,
          transform: 'translate({{shape.middleX}},-20)'
        }));
      }

      // resize.js goes here
    })
  ;
})();