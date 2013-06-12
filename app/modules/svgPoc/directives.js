'use strict';
angular.module('svgPoc')

  .directive('surface', function (surfaceService) {
    return{
      restrict: 'A',
      link: function ($scope, el, attr) {
        surfaceService.element = el;
      }
    };
  })

  .directive('drag', function ($document, surfaceService, $timeout) {
    return {
      restrict: 'A',
      link: function ($scope, el, attr) {
        var box,
          originalX,
          originalY,
          shapeOffsetX,
          shapeOffsetY;

        $scope.$watch(attr.drag, function (value) {
          box = value;
        });

        el.bind('mousedown', function (e) {
          surfaceService.element.bind('mousemove', drag);
          surfaceService.element.bind('mouseup', dragDone);
        });

        function drag(e){
          if(!originalX || !originalY){
            // start of drag
            originalX = e.offsetX;
            originalY = e.offsetY;
            shapeOffsetX = originalX - box.x;
            shapeOffsetY = originalY - box.y;
          }

          var x = e.offsetX - originalX,
              y = e.offsetY - originalY;

          $scope.$apply(function () {
            box.shadow = {x: x, y: y};
          });
        }

        function dragDone(e) {
          surfaceService.element.unbind('mousemove', drag);
          surfaceService.element.unbind('mouseup', dragDone);

          var isMouseClick = isJustMouseClick(e);

          originalX = null
          originalY = null;

          //debugger;
          var x = e.offsetX - shapeOffsetX,
              y = e.offsetY - shapeOffsetY;


          $scope.$apply(function () {

            box.shadow = null;

            if(!isMouseClick){
              box.x = x;
              box.y = y;
            }

            // hack :-(
            // need to calculate transformation after box moved
            $timeout(function() {
              var transform = el[0].getCTM();
              transform.scale = true;
              var transformMatrix = transform.a + " " + transform.b + " " + transform.c + " " + transform.d + " " + transform.e + " " + transform.f;

              box.boundingBox = {
                box: el[0].getBBox(),
                transform: transformMatrix
              };
            }, 0);

          });
        }

        function isJustMouseClick(e){
          if(!originalX || !originalY){
              return true;
          }
          
          var xMovement = originalX - e.offsetX;
          var xMovedLittle = xMovement < 3 && xMovement > -3;

          var yMovement = originalY - e.offsetY;
          var yMovedLittle = yMovement < 3 && yMovement > -3;

          if(xMovedLittle && yMovedLittle){
            // just a mouse click
            return true;
          }

          return false;
        }
      }
    };
  })

  .directive('boundingBox', function (surfaceService) {
    return {
      restrict: 'E',
      templateUrl: 'modules/svgPoc/partials/boundingBox.html',
      replace: true,
//      transclude: true,
      scope: {
        asdfasdf: '='
      },
      controller: function($scope, $element, $attrs){

      }
    };
  })



;
