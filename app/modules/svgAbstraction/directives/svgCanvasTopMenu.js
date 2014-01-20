(function() {
  angular.module('svgAbstraction.directives')
    .directive('svgCanvasTopMenu', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgAbstraction/directives/svgCanvasTopMenu.html',
        controller: 'svgCanvasTopMenuCtrl',
        scope: {
          data: '=',
          mergeDataId: '=mergedataId',
          shapeToDraw: '='
        }
      }
    })
    .controller('svgCanvasTopMenuCtrl', function($scope, shapePaths) {

      // Properties

      $scope.shapePaths = shapePaths.list;
      $scope.shapeKeyValues = shapePaths.keyValues;

      // Actions

      $scope.openMenu = function(menu) {
        var oldVal = $scope[menu];

        $scope.showDrawMenu = false;
        $scope.showSettingsMenu = false;
        $scope.showDataMenu = false;

        if (menu !== 'close') {
          $scope[menu] = !oldVal;
        }

        // TODO: will need to replace when new text reflow code is added
        //HACK
//        $timeout(function() {
//          if (oldVal) {
//            updateAllTextReflows();
//          }
//        }, 200)
      };

      // Functions

      $scope.isActiveShape = function(shape) {
        return $scope.shapeToDraw === shape;
      };

      // Clicks

      $scope.mergeData = function(id) {
        $scope.mergeDataId = id;
      };

      $scope.drawShape = function(shape) {
        $scope.openMenu('close');
//        $scope.unSelectShape();

        // if they click the button twice, undo
        if ($scope.shapeToDraw === shape) {
          $scope.shapeToDraw = null;
        } else {
          $scope.shapeToDraw = shape;
        }

        $scope.$broadcast('shapePickedForDrawing', shape);
      };

      // Computed

      $scope.shapeType = function() {
        if ($scope.shapeToDraw) {
          return $scope.shapeToDraw.key;
        }
      };

    });
}());