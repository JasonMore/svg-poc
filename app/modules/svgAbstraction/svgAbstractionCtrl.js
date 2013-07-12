(function () {
  angular.module('svgAbstraction.controllers', [])
    .controller('svgAbstractionCtrl', function ($scope) {
      $scope.shapes = [{x:50, y: 50}, {x:100, y: 100}];

      $scope.addShape = function() {
        var next = ($scope.shapes.length + 1) * 50;

        $scope.shapes.push({x: next, y: next});
      };

      $scope.removeShape = function() {
        $scope.shapes.splice($scope.shapes.length - 1, 1);
      };

    });
  }());
