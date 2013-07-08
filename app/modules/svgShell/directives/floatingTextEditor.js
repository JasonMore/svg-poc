(function () {
  angular.module('svgShell.directives')
    .directive('floatingTextEditor', function (selectionService) {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgShell/directives/floatingTextEditor.html',
        replace: 'true',
        scope: {
          isEditing: '=',
          textValue: '='
        },
        controller: function($scope) {
          $scope.$watch('isEditing', function(val){
            if(!selectionService.textBoxDimensions){return;}

            $scope.top = selectionService.textBoxDimensions.top;
            $scope.left = selectionService.textBoxDimensions.left;
            $scope.width = selectionService.textBoxDimensions.width;
            $scope.height = selectionService.textBoxDimensions.height;
          })
        }
      }
    })
  ;
})();