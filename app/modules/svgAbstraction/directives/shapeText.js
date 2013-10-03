(function () {
  angular.module('svgAbstraction.directives')
    .directive('shapeText', function () {
      return {
        restrict: 'E',
        replace: 'true',
        scope: {
//          name: '@',
//          options: '=',
//          whenSelected: '&',
//          selection: '=',
//          visible: '=?'
        },
        controller: function ($scope) {

//          if(_.isUndefined($scope.visible)) {
//            $scope.visible = true;
//          }
//
//          $scope.setValue = function(selectedOption) {
//            $scope.selection = selectedOption;
//          };
        }
      }
    })
  ;
})();