'use strict';

angular.module('svgPoc')
  .controller('mainCtrl', function($scope) {
    $scope.boxes = [
      {x:100, y:50, color:"blue"},
      {x:25, y:25, color:"red"}
    ];

    $scope.activeBox = null;

    $scope.setActive = function(box){
      $scope.activeBox = box;
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