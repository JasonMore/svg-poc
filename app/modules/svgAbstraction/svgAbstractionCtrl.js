(function () {
  var importShapes = [
    {
      id: 'shape1',
      top: 25,
      left: 25,
      rotation: 0,
      path: 'M0,0L50,0L50,50L0,50z',
      backgroundColor: 'gray',
      borderColor: 'black',
      borderWidth: 2
    },
    {
      id: 'shape2',
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
      top: 100,
      left: 100,
      rotation: 25,
      path: 'M0,0L100,0L100,100L0,100z',
      backgroundColor: 'gray',
      borderColor: 'black',
      borderWidth: 2
    },
    {
      id: 'picture1',
      top: 150,
      left: 150,
      rotation: 0,
      backgroundColor: '#C9C9C9',
      borderColor: 'black',
      borderWidth: 5,
      path: 'M0,0L150,0L150,150L0,150z',
      image: {
        url: 'http://lorempixel.com/150/150/nature',
        top: 0,
        left: 0,
        width: 150,
        height: 150,
        rotation: 0
      }
    },
    {
      id: 'picture2',
      top: 200,
      left: 200,
      rotation: 0,
      path: 'M124.476,65.714c0.632,-0.291 1.317,-0.462 2.037,-0.462h106.302c-22.534,-39.297 -61.723,-65.305 -106.302,-65.305c-44.633,0 -83.875,26.078 -106.391,65.465l38.174,74.59C59.532,99.481 88.499,66.909 124.476,65.714M239.043,77.388h-76.322c19.261,13.621 32.071,37.772 32.071,65.305c0,13.26 -2.971,25.736 -8.194,36.627c-0.107,0.713 -0.311,1.425 -0.649,2.098l-53.138,103.859c66.954,-3.694 120.225,-66.118 120.225,-142.585C253.045,119.165 247.983,96.971 239.043,77.388M126.513,219.742c-24.563,0 -46.092,-14.635 -58.12,-36.597c-0.516,-0.462 -0.97,-1.034 -1.326,-1.716L13.912,77.539c-8.896,19.533 -13.923,41.686 -13.923,65.164c0,76.527 53.369,138.981 120.403,142.585l38.139,-74.529C148.985,216.49 138.087,219.742 126.513,219.742M68.98,142.703c0,17.947 6.432,34.138 16.85,45.902c10.427,11.764 24.776,19.021 40.683,19.021c15.907,0 30.256,-7.257 40.683,-19.021s16.859,-27.955 16.859,-45.902c0,-17.947 -6.432,-34.128 -16.859,-45.902c-10.427,-11.754 -24.776,-19.011 -40.683,-19.011c-15.907,0 -30.256,7.257 -40.683,19.011C75.412,108.565 68.989,124.756 68.98,142.703z',
      backgroundColor: '#C9C9C9',
      borderColor: 'black',
      borderWidth: 10,
      image: {
        url: 'http://lorempixel.com/1000/600/nature',
        top: -250,
        left: -150,
        width: 1000,
        height: 600,
        rotation: 0
      }
    }
  ];

  angular.module('svgAbstraction.controllers', [])
    .controller('svgAbstractionCtrl', function ($scope, $timeout, shapePaths, shapeViewModelService) {
      window.debugScope = $scope;
      // import

      function createShapeViewModels(shapeDTOs) {
        return _.map(shapeDTOs, function (shape) {
          return shapeViewModelService.create(shape);
        });
      }

      // properties
      $scope.selectedShape = null;
      $scope.shapeToDraw = null;
      $scope.shapePaths = shapePaths.list;
      $scope.shapes = createShapeViewModels(importShapes);

      $scope.colorOptions = [
        {id: 'red', name: 'Red'},
        {id: 'yellow', name: 'Yellow'},
        {id: 'green', name: 'Green'},
        {id: 'blue', name: 'Blue'},
        {id: 'white', name: 'White'},
        {id: 'gray', name: 'Gray'},
        {id: 'black', name: 'Black'},
        {id: 'none', name: '-- None -- '}
      ];

      $scope.strokeWidthOptions = [
        {id: 1, name: '1'},
        {id: 2, name: '2'},
        {id: 3, name: '3'},
        {id: 4, name: '4'},
        {id: 5, name: '5'},
        {id: 6, name: '6'},
        {id: 7, name: '7'},
        {id: 8, name: '8'},
        {id: 9, name: '9'},
        {id: 10, name: '10'},
        {id: 11, name: '11'},
        {id: 12, name: '12'},
        {id: 13, name: '13'},
        {id: 14, name: '14'}
      ];

      $scope.fontSizeOptions = [
        {id: '8.0', name: '8'},
        {id: '9.0', name: '9'},
        {id: '10.0', name: '10'},
        {id: '11.0', name: '11'},
        {id: '12.0', name: '12'},
        {id: '13.0', name: '13'},
        {id: '14.0', name: '14'},
        {id: '15.0', name: '15'},
        {id: '16.0', name: '16'},
        {id: '17.0', name: '17'}
      ];

      $scope.fontFamilyOptions = [
        {id: 'Arial', name: 'Arial'},
        {id: 'Cambria', name: 'Cambria'},
        {id: 'Consolas', name: 'Consolas'},
        {id: 'Verdana', name: 'Verdana'}
      ];

      // actions
      $scope.setSelectedShape = function (shape) {
        if($scope.selectedShape === shape){
          return;
        }

        $scope.unSelectShape();

        // when creating a new shape, its not always drawn yet
        $timeout(function () {
          $scope.selectedShape = shape;
          $scope.shapeToDraw = null;
        })
      };

      $scope.deleteShape = function () {
        $scope.shapes.remove($scope.selectedShape);
        $scope.unSelectShape();
      };

      $scope.canDragShape = function (shape) {
        return true;
      };

      $scope.drawShape = function (shape) {
        $scope.unSelectShape();

        // if they click the button twice, undo
        if ($scope.shapeToDraw === shape) {
          $scope.shapeToDraw = null;
        } else {
          $scope.shapeToDraw = shape;
        }
      };

      $scope.unSelectShape = function () {
        if (!$scope.selectedShape) {
          return;
        }

        $scope.selectedShape.showPreviewImage = false;
        $scope.selectedShape = null;
      };

      // computed
      $scope.shapeType = function () {
        if ($scope.shapeToDraw) {
          return $scope.shapeToDraw.key;
        }
      };

      $scope.isDrawing = function () {
        return _.isObject($scope.shapeToDraw);
      };

      $scope.isActiveShape = function (shape) {
        return $scope.shapeToDraw === shape;
      };

      $scope.menuTop = function () {
        if (!$scope.selectedShape) {
          return 0;
        }
        return $scope.selectedShape.model.top + 30;
      };

      $scope.menuLeft = function () {
        if (!$scope.selectedShape) {
          return 0;
        }

        return $scope.selectedShape.model.left + $scope.selectedShape.width() - 120;
      };

      $scope.shapesInfo = function () {
        return _.map($scope.shapes, function (shapeViewmodel) {
          return shapeViewmodel.model;
        });
      };

      $scope.showShapeMenu = function () {
        if (!$scope.selectedShape) {
          return false;
        }

        if ($scope.selectedShape.isDragging) {
          return false;
        }

        if ($scope.selectedShape.isResizing) {
          return false;
        }

        return true;
      };
    });
}());