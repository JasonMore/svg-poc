(function () {
  angular.module('svgAbstraction.controllers', [])
    .controller('svgAbstractionCtrl', function ($scope) {
      $scope.shapesInfo = function () {
        return _.map($scope.shapes, function (shape) {
          return
        });
      };

      $scope.selectedShape = null;

      $scope.setSelectedShape = function (shape) {
        $scope.selectedShape = shape;
      };

      $scope.shapes = [
        {
          id: 'shape1',
          type: 'shape',
          top: 25,
          left: 25,
          rotation: 0,
          path: 'M0,0L50,0L50,50L0,50z',
          backgroundColor: 'gray',
          borderColor: 'black',
          borderWidth: '2'
        },
        {
          id: 'shape2',
          type: 'shape',
          top: 50,
          left: 50,
          rotation: 15,
          path: 'M0,0L100,0L100,100L0,100z',
          backgroundColor: 'green',
          borderColor: 'blue',
          borderWidth: 12
        },
        {
          id: 'shape3',
          type: 'shape',
          top: 100,
          left: 100,
          rotation: 25,
          path: 'M0,0L100,0L100,100L0,100z',
          backgroundColor: 'gray',
          borderColor: 'black',
          borderWidth: '2'
        },
        {
          id: 'picture1',
          type: 'image',
          top: 150,
          left: 150,
          width: 150,
          height: 150,
          rotation: 0,
          backgroundColor: '#C9C9C9',
          borderColor: 'black',
          borderWidth: '5',
          clipPath: 'M0,0L100,0L100,100L0,100z',
          image: {
            url: 'http://lorempixel.com/150/150/nature'
//            x: 0,
//            y: 0,
//            width: 161,
//            height: 106
          }
        },
        {
          id: 'picture2',
          type: 'image',
          top: 200,
          left: 200,
          width: 500,
          height: 300,
          rotation: 0,
          backgroundColor: '#C9C9C9',
          borderColor: 'black',
          borderWidth: '5',
//          clipPath: 'M0,0L100,0L100,100L0,100z',
          image: {
            url: 'http://lorempixel.com/1000/600/nature'
//            x: 0,
//            y: 0,
//            width: 161,
//            height: 106
          }
        }
      ];

      $scope.clips = [
        {
          id: 'clip1',
          path: 'M0,0L100,0L100,100L0,100z'
        }
      ];

      $scope.increaseX = function () {
        $scope.shapes[0].left += 1;
      }

      $scope.increaseY = function () {
        $scope.shapes[0].top += 1;
      }

      $scope.addShape = function () {
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

      $scope.removeShape = function () {
        $scope.shapes.splice($scope.shapes.length - 1, 1);
      };

      $scope.canDragShape = function (shape) {
        return true;
      };

    });
}());