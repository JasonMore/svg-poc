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

  .directive('drag', function ($document, surfaceService) {
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

          originalX = null;
          originalY = null;

          var x = e.offsetX - shapeOffsetX,
              y = e.offsetY - shapeOffsetY;

//          var transform = el[0].getCTM();
//          transform.scale = true;
//          var transformMatrix = transform.a + " " + transform.b + " " + transform.c + " " + transform.d + " " + transform.e + " " + transform.f;

          $scope.$apply(function () {
            box.shadow = null;

            box.x = x;
            box.y = y;

//            $scope.$parent.boundingBox = {
//              box: el[0].getBBox(),
//              transform: transformMatrix
//            };
//

          });
        }
      }
    };
  })

  .directive('boundingBox', function (surfaceService) {
    return {
      restrict: 'E',
      template: '<rect x="{{x}}" y="{{y}}" width="0" height="0" stroke="black" fill="yellow" opacity="0.4"/>',
      scope: {
        model: '='
      },
      controller: function($scope, $element, $attrs){
        if(!$scope.model){
          return;
        }

        $scope.x = $scope.model.box.x;
        $scope.y = $scope.model.box.y;
        $scope.width = $scope.model.box.width;
        $scope.height = $scope.model.box.height;

        $scope.$watch($scope.model, function (newVal, oldVal) {
          if (newVal === oldVal) {
            return;
          }

          $element[0].setAttributeNS(null, "transform", "matrix(" + $scope.model.transform + ")");
        });
      }
//      link: function ($scope, el, attr) {
//        $scope.$watch(attr.transform, function (newVal, oldVal) {
//          if (newVal === oldVal) {
//            return;
//          }
//
//          el[0].setAttributeNS(null, "transform", "matrix(" + $scope.boundingBoxTransform + ")");
//        });
//      }

    };
  })

//  .directive('boxable', function (surfaceService) {
//    return {
//      restrict: 'A',
//      link: function ($scope, el, attr) {
//        var boundingBox;
//
//        $scope.$watch(attr.boxable, function (value) {
//          boundingBox = value;
//        });
//
//        el.bind('mousedown', function (e) {
//
//          var transform = el[0].getCTM();
//          transform.scale = true;
//          var transformMatrix = transform.a + " " + transform.b + " " + transform.c + " " + transform.d + " " + transform.e + " " + transform.f;
//
//          $scope.$apply(function () {
//            $scope.boundingBox = {
//              box: el[0].getBBox(),
//              transform: transformMatrix
//            };
//          });
//        });
//      }
//    };
//  })
//      link: function ($scope, el, attr) {
//
//        el.bind('mousedown', function (e) {
//
//          var transform = el[0].getCTM();
//          transform.scale = true;
//          var transformMatrix = transform.a + " " + transform.b + " " + transform.c + " " + transform.d + " " + transform.e + " " + transform.f;
//
//          attr.boxable = {
//            box: el[0].getBBox(),
//            transform: transformMatrix
//          }
//        });

//        var boundingBox;
//        var transform;
//        var text;
//        var Ti;
//
//        function startup(){
//          boundingBox = document.getElementById("BB");
//          text = document.getElementsByTagName("text");
//          for (var i=0;i<text.length;i++){
//            Ti = text.item(i);
//            Ti.setAttribute("onmouseover", "draw(evt)");
//            Ti.setAttribute("onmousedown", "snug(evt)");
//          }
//        }
//        function draw(evt,s){
//          var O = evt.target;
//          var Box = O.getBBox();
//          boundingBox.setAttributeNS(null, "x", Box.x);
//          boundingBox.setAttributeNS(null, "y", Box.y);
//          boundingBox.setAttributeNS(null, "width", Box.width);
//          boundingBox.setAttributeNS(null, "height", Box.height);
//          transform=O.getCTM()
//        }
//        function snug(evt) {
//          transform.scale = true;
//          var s = transform.a + " " + transform.b + " " + transform.c + " " + transform.d + " " + transform.e + " " + transform.f;
//          boundingBox.setAttributeNS(null, "transform", "matrix(" + s + ")");
//        }




;
