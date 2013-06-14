(function() {
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

    .directive('drag', function (surfaceService, svgService) {
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

          function drag(e) {
            if (!originalX || !originalY) {
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

              if (!isMouseClick) {
                box.x = x;
                box.y = y;
              }

              svgService.recalculateTransformation(el[0], box);
            });
          }

          function isJustMouseClick(e) {
            if (!originalX || !originalY) {
              return true;
            }

            var xMovement = originalX - e.offsetX;
            var xMovedLittle = xMovement < 3 && xMovement > -3;

            var yMovement = originalY - e.offsetY;
            var yMovedLittle = yMovement < 3 && yMovement > -3;

            if (xMovedLittle && yMovedLittle) {
              // just a mouse click
              return true;
            }

            return false;
          }
        }
      };
    })

    .directive('resize', function (surfaceService, svgService) {
      return {
        restrict: 'A',
        link: function ($scope, el, attr) {
          var box,
            originalX,
            originalY;

          $scope.$watch(attr.resize, function (value) {
            box = value;
          });

          el.bind('mousedown', function (e) {
            surfaceService.element.bind('mousemove', drag);
            surfaceService.element.bind('mouseup', dragDone);
          });

          function drag(e) {
            if (!originalX || !originalY) {
              // start of drag
              originalX = e.offsetX;
              originalY = e.offsetY;
            }

            var x = e.offsetX / originalX,
              y = e.offsetY / originalY;

            $scope.$apply(function () {
              box.shadow.scale = {x: x, y: y};
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

              if (!isMouseClick) {
                box.x = x;
                box.y = y;
              }

              svgService.recalculateTransformation(el[0], box);
            });
          }

          function isJustMouseClick(e) {
            if (!originalX || !originalY) {
              return true;
            }

            var xMovement = originalX - e.offsetX;
            var xMovedLittle = xMovement < 3 && xMovement > -3;

            var yMovement = originalY - e.offsetY;
            var yMovedLittle = yMovement < 3 && yMovement > -3;

            if (xMovedLittle && yMovedLittle) {
              // just a mouse click
              return true;
            }

            return false;
          }
        }

      }
    })
//
//    .directive('boundingBox', function (svgService) {
//      return {
//        restrict: 'E',
//        templateUrl: 'boundingBox_inline_big.html',
//        replace: true,
//        compile: svgService.compile
//      };
//    })

  .directive('boundingBox', function(svgService, $templateCache) {
    return {
      restrict: 'E',
      //templateUrl: 'boundingBox.html',
      template: $templateCache.get('boundingBox_inline_big.html'),
      replace: true,
      compile: svgService.compile
    };
  })

    .directive('corner', function (svgService) {
      return {
        restrict: 'E',
        replace: true,
        template: '<rect class="nwse-resize" stroke="white" fill="blue" width="6" height="6" ng-attr-x="{{activeBox.boundingBox.box.x - 6 }}" ng-attr-y="{{activeBox.boundingBox.box.y - 6}}"></rect>',
        compile: svgService.compile
      }
    })

  ;
}());
