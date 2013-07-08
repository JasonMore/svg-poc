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
          visible: '='
        },
        controller: function ($scope) {
          //check for a noop action
          $scope.action = function(selectedOption) {
            $scope.selection = selectedOption;
            if($scope.whenSelected){
              $scope.whenSelected(selectedOption);
            }
          };
        }
      }
    })
  ;
})();