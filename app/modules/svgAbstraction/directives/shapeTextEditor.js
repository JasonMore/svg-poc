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
          $scope.fontSizePx = function() {
            return $scope.fontSize + 'px';
          }
        }
      }
    })
  ;
})();