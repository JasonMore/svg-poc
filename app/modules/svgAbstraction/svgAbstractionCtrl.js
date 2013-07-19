(function () {
  angular.module('svgAbstraction.controllers', [])
    .controller('svgAbstractionCtrl', function ($scope) {
      $scope.selectedShape = null;

      $scope.setSelectedShape = function(shape){
        $scope.selectedShape = shape;
      };

      $scope.shapes = [
        {
          top: 25,
          left: 25,
          path: 'M0,0L50,0L50,50L0,50z',
          backgroundColor: 'gray',
          borderColor: 'black',
          borderWidth: '2'
        },
        {
          top: 50,
          left: 50,
          path: 'M0,0L100,0L100,100L0,100z',
          backgroundColor: 'green',
          borderColor: 'blue',
          borderWidth: 12
        },
        {
          top: 100,
          left: 100,
          path: 'M0,0L100,0L100,100L0,100z',
          backgroundColor: 'gray',
          borderColor: 'black',
          borderWidth: '2'
        }
      ];

      $scope.increaseX = function() {
        $scope.shapes[0].left += 1;
      }

      $scope.increaseY = function() {
        $scope.shapes[0].top += 1;
      }

      $scope.addShape = function() {
        var next = ($scope.shapes.length + 1) * 50;

        $scope.shapes.push({
          top: next,
          left: next,
          path: 'M0,0L100,0L100,100L0,100z',
          backgroundColor: 'gray',
          borderColor: 'black',
          borderWidth: '2'
        });
      };

      $scope.removeShape = function() {
        $scope.shapes.splice($scope.shapes.length - 1, 1);
      };

      $scope.canDragShape = function(shape) {
        return true;
      };

    });
  }());