(function () {
  'use strict';

  angular.module('svgPoc.controllers', [])
    .controller('svgPocCtrl', function ($scope, $timeout, surfaceService) {
      $scope.oldShapes = [];

      $scope.boxes = [
        {x: 100, y: 50, color: "blue"},
        {x: 25, y: 25, color: "red"}
      ];

      var emptyBoundingBox = {
        box: {x: 0, y: 0, width: 0, height: 0},
        transform: ""
      };

      $scope.activeBox = null;

      $scope.setActive = function (box, $event) {
        $scope.activeBox = box;
        $scope.activeBox.boundingBox = calculateBoundingBox(box, $event);

      };

//    move to directive
      function calculateBoundingBox(box, $event) {
        var transform = $event.target.getCTM();
        transform.scale = true;
        var transformMatrix = transform.a + " " + transform.b + " " + transform.c + " " + transform.d + " " + transform.e + " " + transform.f;

        return {
          box: $event.target.getBBox(),
          transform: transformMatrix
        };
      }

      $scope.unSelect = function ($event) {
        // Todo: directive?
        if ($event.target != surfaceService.element[0]) {
          return;
        }

        $scope.activeBox = null;
        $scope.boundingBox = emptyBoundingBox;
      };

      $scope.addBox = function () {
        var newBox = {x: 50, y: 50, color: "orange"};
        $scope.activeBox = newBox;
        $scope.boxes.push(newBox);
      };

      $scope.deleteCurrentBox = function () {
        if ($scope.activeBox) {
          $scope.boxes.remove($scope.activeBox);
          $scope.activeBox = null;
        }
      };
    })
  ;

}());