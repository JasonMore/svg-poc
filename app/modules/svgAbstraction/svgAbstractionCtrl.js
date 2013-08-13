(function () {
  angular.module('svgAbstraction.controllers', [])
    .controller('svgAbstractionCtrl', function ($scope, $timeout, shapePaths) {
      $scope.shapesInfo = function () {
        return _.map($scope.shapes, function (shape) {
          return;
        });
      };

      // properties
      $scope.selectedShape = null;
      $scope.shapeToDraw = null;

      $scope.shapes = [
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
            x: 0,
            y: 0,
            width: 150,
            height: 150
          }
        },
        {
          id: 'picture2',
          top: 200,
          left: 200,
          rotation: 0,
          path: 'M190.95184190571857,18.67034584574202c-22.323836384105082,-25.959966259055825 -59.94907374597721,-24.70023237340574 -83.60038330843584,2.7667085108788574L103.48050782485348,25.934428571291733l-3.870951376425747,-4.497373337497029c-23.651309562458632,-27.466939656241248 -61.27654692433076,-28.726676348847562 -83.60038330843584,-2.7667085108788574c-22.333969029440297,25.936421510213755 -21.2598313123552,69.65041398214339 2.381344245776086,97.11735083142841l85.07985583076164,98.8480189913071l85.07985583076164,-98.8480189913071C212.20154057273854,88.32075982788542 213.28581576713086,44.60676174204332 190.95184190571857,18.67034584574202z',
          backgroundColor: '#C9C9C9',
          borderColor: 'black',
          borderWidth: 10,
          image: {
            url: 'http://lorempixel.com/1000/600/nature',
            x: -250,
            y: -150,
            width: 1000,
            height: 600
          }
        }
      ];

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

      $scope.shapePaths = shapePaths.list;

      // actions
      $scope.setSelectedShape = function (shape) {

        // when creating a new shape, its not always drawn yet
        $timeout(function () {
          $scope.selectedShape = shape;
          $scope.shapeToDraw = null;
        })
      };

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

      $scope.drawShape = function (shape) {
        $scope.selectedShape = null;

        // if they click the button twice, undo
        if($scope.shapeToDraw === shape){
          $scope.shapeToDraw = null;
        } else {
          $scope.shapeToDraw = shape;
        }
      };

      // computed
      $scope.shapeType = function () {
        if($scope.shapeToDraw){
          return $scope.shapeToDraw.key;
        }
      };

      $scope.isDrawing = function () {
        return _.isObject($scope.shapeToDraw);
      };

      $scope.isActiveShape = function(shape){
        return $scope.shapeToDraw === shape;
      };

    });
}());