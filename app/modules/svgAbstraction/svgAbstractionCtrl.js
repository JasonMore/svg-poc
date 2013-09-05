(function () {
  var importShapes = [
    {
      "id": "shape1",
      "top": 25,
      "left": 25,
      "rotation": 0,
      "path": "M0,0L50,0L50,50L0,50z",
      "backgroundColor": "gray",
      "borderColor": "black",
      "borderWidth": 2
    },
    {
      "id": "shape2",
      "top": 50,
      "left": 50,
      "rotation": 15,
      "path": "M0,0L100,0L100,100L0,100z",
      "backgroundColor": "green",
      "borderColor": "blue",
      "borderWidth": 12
    },
    {
      "id": "shape3",
      "top": 100,
      "left": 100,
      "rotation": 25,
      "path": "M0,0L100,0L100,100L0,100z",
      "backgroundColor": "gray",
      "borderColor": "black",
      "borderWidth": 2
    },
    {
      "id": "picture1",
      "top": 150,
      "left": 148,
      "rotation": 0,
      "backgroundColor": "#C9C9C9",
      "borderColor": "black",
      "borderWidth": 5,
      "path": "M0,0L150,0L150,150L0,150z",
      "image": {
        "url": "http://lorempixel.com/150/150/nature/1",
        "top": 1,
        "left": 1,
        "width": 150,
        "height": 150,
        "rotation": 0
      }
    },
    {
      "id": "picture2",
      "top": 25,
      "left": 480,
      "rotation": 0,
      "path": "M124.476,65.714c0.632,-0.291 1.317,-0.462 2.037,-0.462h106.302c-22.534,-39.297 -61.723,-65.305 -106.302,-65.305c-44.633,0 -83.875,26.078 -106.391,65.465l38.174,74.59C59.532,99.481 88.499,66.909 124.476,65.714M239.043,77.388h-76.322c19.261,13.621 32.071,37.772 32.071,65.305c0,13.26 -2.971,25.736 -8.194,36.627c-0.107,0.713 -0.311,1.425 -0.649,2.098l-53.138,103.859c66.954,-3.694 120.225,-66.118 120.225,-142.585C253.045,119.165 247.983,96.971 239.043,77.388M126.513,219.742c-24.563,0 -46.092,-14.635 -58.12,-36.597c-0.516,-0.462 -0.97,-1.034 -1.326,-1.716L13.912,77.539c-8.896,19.533 -13.923,41.686 -13.923,65.164c0,76.527 53.369,138.981 120.403,142.585l38.139,-74.529C148.985,216.49 138.087,219.742 126.513,219.742M68.98,142.703c0,17.947 6.432,34.138 16.85,45.902c10.427,11.764 24.776,19.021 40.683,19.021c15.907,0 30.256,-7.257 40.683,-19.021s16.859,-27.955 16.859,-45.902c0,-17.947 -6.432,-34.128 -16.859,-45.902c-10.427,-11.754 -24.776,-19.011 -40.683,-19.011c-15.907,0 -30.256,7.257 -40.683,19.011C75.412,108.565 68.989,124.756 68.98,142.703z",
      "backgroundColor": "#C9C9C9",
      "borderColor": "black",
      "borderWidth": 10,
      "image": {
        "url": "http://lorempixel.com/1000/600/abstract/3",
        "top": -28,
        "left": -288,
        "width": 557,
        "height": 365,
        "rotation": 0
      }
    },
    {
      "id": "232448be-8986-44c8-e0a8-9dd1ff381f25",
      "top": 109,
      "left": 384,
      "rotation": 0,
      "path": "M340.141,84.282L88.668,60.482L73.338,10.848C72.252,7.436 68.602,5.026 64.465,5.026H26.727C23.956,1.979 19.819,-0.097 14.961,-0.097c-8.373,0 -15.159,5.801 -15.159,12.959c0,7.158 6.786,12.959 15.159,12.959c4.87,0 9.007,-2.097 11.778,-5.144h30.659l63.833,206.591c-6.688,6.146 -10.875,14.326 -10.875,23.393c0,19 17.978,34.359 40.191,34.359c22.213,0 40.204,-15.359 40.24,-34.359c0,-2.682 -0.439,-5.259 -1.135,-7.752h67.531c-0.683,2.494 -1.123,5.071 -1.123,7.752c0,19 18.002,34.359 40.216,34.359s40.216,-15.359 40.216,-34.359c0,-18.99 -17.978,-34.38 -40.216,-34.401c-11.607,0.01 -21.981,4.267 -29.317,10.987h-87.095c-7.335,-6.719 -17.71,-10.976 -29.317,-10.987c-4.626,0 -9.007,0.814 -13.145,2.045l-2.209,-7.147H313.168c14.121,-0.282 26.094,-8.66 29.182,-20.44l19.211,-81.374c0.342,-1.513 0.5,-2.942 0.476,-4.32C362.147,94.497 352.724,85.388 340.141,84.282M296.3,253.728c-1.989,0 -3.6,-1.377 -3.625,-3.078c0.024,-1.722 1.635,-3.099 3.625,-3.099s3.6,1.377 3.625,3.099C299.901,252.351 298.29,253.728 296.3,253.728M318.025,175.526l11.57,-9.891l-3.881,16.465L318.025,175.526M141.625,81.246l12.644,10.81l-15.769,13.481l-15.769,-13.481l13.267,-11.342L141.625,81.246M196.524,86.442l6.566,5.613l-15.769,13.481l-15.769,-13.481l8.397,-7.179L196.524,86.442M103.497,108.499l10.594,-9.057l15.769,13.481l-15.769,13.481l-6.884,-5.885L103.497,108.499M99.884,96.823l-4.003,-12.938L105.462,92.066L99.884,96.823M251.91,133.791l-15.769,13.481l-15.769,-13.481l15.769,-13.481L251.91,133.791M244.783,112.933l15.769,-13.481l15.769,13.481l-15.769,13.481L244.783,112.933M211.744,126.403l-15.781,-13.481l15.769,-13.481l15.769,13.481L211.744,126.403M203.09,133.791L187.333,147.271l-15.769,-13.481l15.769,-13.481L203.09,133.791M162.911,126.403l-15.769,-13.481l15.769,-13.481l15.769,13.481L162.911,126.403M154.27,133.791l-15.769,13.47l-15.769,-13.47l15.769,-13.481L154.27,133.791M114.091,141.178l15.769,13.481l-9.581,8.18l-6.591,-21.327L114.091,141.178M123.891,174.535l14.609,-12.489l15.769,13.481L138.513,189.007l-13.804,-11.79L123.891,174.535M147.154,154.658l15.757,-13.481l15.769,13.481L162.923,168.139L147.154,154.658M187.333,162.046l15.769,13.481L187.333,188.996l-15.769,-13.47L187.333,162.046M195.975,154.658l15.769,-13.481l15.757,13.481L211.744,168.129L195.975,154.658M236.141,162.046l15.769,13.481L236.154,188.996l-15.769,-13.481L236.141,162.046M244.783,154.658l15.769,-13.481l15.769,13.481l-15.769,13.481L244.783,154.658M269.193,133.791l15.769,-13.481l15.769,13.481l-15.769,13.481L269.193,133.791M293.603,112.923l15.769,-13.481L325.129,112.933l-15.757,13.481L293.603,112.923M284.962,105.546l-14.109,-12.062l25.411,2.4L284.962,105.546M251.91,92.066l-15.769,13.481L220.373,92.066l3.539,-3.026l27.498,2.608L251.91,92.066M162.923,84.668l-1.855,-1.586l3.332,0.313L162.923,84.668M114.103,84.678l-7.933,-6.782l14.292,1.346L114.103,84.678M162.923,182.913l14.707,12.573h-29.402L162.923,182.913M211.731,182.913l14.719,12.583h-29.439L211.731,182.913M260.552,182.913l14.744,12.594l-29.463,-0.01L260.552,182.913M269.193,175.526l15.769,-13.481l15.769,13.481l-15.769,13.481L269.193,175.526M293.603,154.658l15.769,-13.47l15.757,13.47l-15.757,13.481L293.603,154.658M333.782,147.271l-15.757,-13.481l15.757,-13.47l5.419,4.633l-5.236,22.162L333.782,147.271M339.909,100.298l-6.127,5.238l-8.031,-6.865l12.4,1.169C338.811,99.922 339.36,100.11 339.909,100.298M150.559,253.728c-1.965,0 -3.6,-1.377 -3.6,-3.078c0,-1.722 1.635,-3.099 3.6,-3.099c1.989,0 3.613,1.377 3.613,3.099C154.172,252.351 152.561,253.728 150.559,253.728M313.168,195.507h-18.515l14.732,-12.594l11.351,9.704C318.452,194.38 315.572,195.653 313.168,195.507z",
      "backgroundColor": "gray",
      "borderColor": "black",
      "borderWidth": 2,
      "image": {
        "url": "http://lorempixel.com/999/599/food/9",
        "top": -42,
        "left": -39,
        "width": 494,
        "height": 364,
        "rotation": 0
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

      $scope.$on('$routeChangeSuccess', function (event, routeData) {
        console.log('done!');
      });

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
        if ($scope.selectedShape === shape) {
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

      // watches

      // hack

//      debugger;
      var socket = io.connect();

      $scope.$watch('selectedShape.model | json ', function (newVal, oldVal) {
        if (newVal === oldVal || !$scope.selectedShape) {
          return;
        }

        update($scope.selectedShape.model);
      });

      var update;

      socket.on('pageUpdated', function (infos) {
        console.log(Date(), infos);

        var indexToUpdate = _.findIndex($scope.shapes, function (shape) {
          return shape.model.id === infos.selectedShapeModel.id;
        });

        $scope.$apply(function () {
          $scope.shapes[indexToUpdate].updateModel(infos.selectedShapeModel);
        });
      })



      // debug
      $scope.debug = false;
      $scope.debugThrottle = 500;

      $scope.$watch('debugThrottle', function (throttleAmount) {
        update = _.throttle(function (selectedShapeModel) {
          socket.emit('pageSave', {selectedShapeModel: selectedShapeModel}, function(savedPage) {
            console.log(savedPage);
          });
        }, throttleAmount, {leading: false});
      });

    });
}());