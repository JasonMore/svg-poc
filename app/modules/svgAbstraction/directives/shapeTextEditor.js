(function () {
  angular.module('svgAbstraction.directives')
    .directive('shapeTextEditor', function () {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgAbstraction/directives/shapeTextEditor.html',
        replace: 'true',
        scope: {
          isEditing: '=',
          textValue: '=',
          fontFamily: '=',
          fontSize: '=',
          top:'@',
          left:'@',
          width:'@',
          height:'@'
        },
        controller: function($scope) {

          $scope.$watch('textValue', function(val){
            console.log($scope);
//            if(!selectionService.textBoxDimensions){return;}
//
//            $scope.top = selectionService.textBoxDimensions.top;
//            $scope.left = selectionService.textBoxDimensions.left;
//            $scope.width = selectionService.textBoxDimensions.width;
//            $scope.height = selectionService.textBoxDimensions.height;
          });

          $scope.fontSizePx = function() {
            return $scope.fontSize + 'px';
          }
        }
      }
    })
  ;
})();