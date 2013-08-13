(function () {
  angular.module('svgAbstraction.directives')
    .directive('shapeOptions', function () {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgAbstraction/directives/shapeOptions.html',
        replace: 'true',
        scope: {
          name: '@',
          options: '=',
          whenSelected: '&',
          selection: '=',
          visible: '=?'
        },
        controller: function ($scope) {

          if(_.isUndefined($scope.visible)) {
            $scope.visible = true;
          }

          $scope.setValue = function(selectedOption) {
            $scope.selection = selectedOption;
          };
        }
      }
    })
  ;
})();