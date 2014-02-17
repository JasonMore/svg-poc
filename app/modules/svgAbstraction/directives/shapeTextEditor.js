(function () {
  angular.module('svg-poc')
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
        link: function($scope, el) {
          $scope.fontSizePx = function() {
            return $scope.fontSize + 'px';
          };

          $scope.$watch('isEditing', function(val){
            if(val){
              el.focus();
            }
          });
        }
      }
    })
  ;
})();