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
        controller: function($scope) {
          this.draw = SVG('drawCanvas').size($scope.width, $scope.height);
        },
        link: function(scope, el, attrs, controller){
//          scope.draw = SVG('drawCanvas').size(scope.width, scope.height);
        }
      };
    })

    .directive('svgRect', function() {
      return {
        restrict:'E',
        require:'^svgSurface',
        scope: {
          width: '=',
          height: '='
        },
        link: function(scope, el, attrs, svgSurface) {
          var rect = svgSurface.draw.rect(scope.width, scope.height);

          scope.rect = rect;

          scope.$watch('width + height', function(newVal, oldVal){
            if(newVal == oldVal) { return; }
            rect.size(scope.width, scope.height);
          });

          scope.$on('$destroy', function() {
            rect.remove();
          })
        }
      }
    })

    .directive('svgPath', function() {
      return {
        restrict:'E',
        require:'^svgSurface',
        scope: {
          definition: '='
        },
        link: function(scope, el, attrs, svgSurface) {
          var path = svgSurface.draw.path(scope.definition);

          //this.path = scope.path;

          scope.$watch('definition', function(newVal, oldVal){
            if(newVal == oldVal) { return; }
            path.attr('d',newVal);
          });

          scope.$on('$destroy', function () {
            path.remove();
          });
        }
      }
    })

    .directive('draggable', function() {
      return {
        restrict:'A',
//        require:'^svgSurface',
//        scope: {
//          definition: '='
//        },
        link: function(scope, el, attrs, svgSurface) {
//          debugger;
          scope.rect.draggable();
        }
      }
    })

  ;

}());