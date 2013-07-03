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
            if(!selectionService.boundingBox){return;}

            $scope.top = selectionService.translationOffset.top;
            $scope.left = selectionService.translationOffset.left;
            $scope.width = selectionService.boundingBox.width;
            $scope.height = selectionService.boundingBox.height;
          })
        }
      }
    })
  ;
})();