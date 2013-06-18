(function () {
  'use strict';

  angular.module('svgJS')
    .directive('svgSurface', function ($rootScope) {
      return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div ng-transclude><div id="drawCanvas"></div></div>',
        scope: {
          width: '@',
          height: '@'
        },
        controller: function ($scope) {
          this.draw = SVG('drawCanvas').size($scope.width, $scope.height);
        },
        link: function (scope, el, attrs, controller) {
//          scope.draw = SVG('drawCanvas').size(scope.width, scope.height);
        }
      };
    })

    .directive('svgRect', function () {
      return {
        restrict: 'E',
        require: '^svgSurface',
        scope: {
          width: '=',
          height: '='
        },
        link: function (scope, el, attrs, svgSurface) {
          scope.shape = svgSurface.draw.rect(scope.width, scope.height);

          scope.$watch('width + height', function (newVal, oldVal) {
            if (newVal == oldVal) {
              return;
            }
            scope.shape.size(scope.width, scope.height);
          });

          scope.$on('$destroy', function () {
            scope.shape.remove();
          })
        }
      }
    })

    .directive('svgPath', function () {
      return {
        restrict: 'E',
        require: '^svgSurface',
        scope: {
          definition: '='
        },
        link: function (scope, el, attrs, svgSurface) {
          scope.shape = svgSurface.draw.path(scope.definition);

          scope.$watch('definition', function (newVal, oldVal) {
            if (newVal == oldVal) {
              return;
            }
            scope.shape.attr('d', newVal);
          });

          scope.$on('$destroy', function () {
            scope.shape.remove();
          });
        }
      }
    })

//  https://github.com/wout/svg.draggable.js
    .directive('draggable', function () {
      return {
        restrict: 'A',
//        require:'^svgSurface',
//        scope: {
//          definition: '='
//        },
        link: function (scope, el, attr) {
          scope.$watch(attr.draggable, function (newVal, oldVal) {
//            if(newVal){
              scope.shape.draggable();
//            } else if(scope.shape.fixed){
//              scope.shape.fixed();
//            }
          });
        }
      }
    })

  ;


}());