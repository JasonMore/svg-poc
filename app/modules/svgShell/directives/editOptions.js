(function () {
  angular.module('svgShell.directives')
    .directive('editOptions', function () {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgShell/directives/editOptions.html',
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