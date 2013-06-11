'use strict';

angular.module('svgPoc')
  .controller('mainCtrl', function($scope, $timeout) {
    $scope.boxes = [
      {x:100, y:50, color:"blue"},
      {x:25, y:25, color:"red"}
    ];

    var emptyBoundingBox = {
      box: {x: 0, y: 0, width: 0, height: 0},
      transform: ""
    };

    $scope.activeBox = null;
    $scope.boundingBox = emptyBoundingBox;

    $scope.setActive = function(box){
      $scope.isClicking = true;
      $scope.activeBox = box;

      $timeout(function() {
        $scope.isClicking = false;
      }, 0);
    };

    $scope.unSelect = function() {
      if($scope.isClicking){
        return;
      }

      $scope.activeBox = null;
      $scope.boundingBox = emptyBoundingBox;
    };

    $scope.addBox = function() {
      var newBox = {x: 50, y: 50, color:"orange"};
      $scope.activeBox = newBox;
      $scope.boxes.push(newBox);
    };

    $scope.deleteCurrentBox = function() {
      if($scope.activeBox){
        $scope.boxes.remove($scope.activeBox);
        $scope.activeBox = null;
      }
    };
  })
;