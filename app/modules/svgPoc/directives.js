'use strict';
angular.module('svgPoc')

  .directive('surface', function(surfaceService){
    return{
      restrict:'A',
      link: function(scope, el, attr){
        surfaceService.element = el;
      }
    };
  })

  .directive('drag', function($document, surfaceService) {
    return {
      restrict:'A',
      link: function(scope, el, attr){
        var box;

        scope.$watch(attr.drag, function(value){
          box = value;
        });

        var drag = function(e) {

          var x = e.offsetX,
            y = e.offsetY;

          scope.$apply(function() {
            scope.box.x = x;
            scope.box.y = y;
          });

        };

        el.bind('mousedown', function(e) {
          surfaceService.element.bind('mousemove',drag);
        });

        el.bind('mouseup', function(e) {
          surfaceService.element.unbind('mousemove', drag);
        });
      }
    };
  })
;