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
        replace: true,
        transclude: true,
        template:'<div ng-transclude></div>',
        scope: {
          width: '@',
          height: '@'
        },
        link: function(scope, el, attrs, svgSurface) {
          svgSurface.draw.rect(scope.width, scope.height);
        }
      }
    });
  ;

}());