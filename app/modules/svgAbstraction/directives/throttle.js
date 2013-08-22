(function () {
  angular.module('svgAbstraction.directives')
    .directive('throttle', function ($parse) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, $element, $attr, ngModelCtrl) {
          if ($attr.type === 'radio' || $attr.type === 'checkbox') return;

          var throttleAmount = $parse($attr.throttle)() || 500;

          var throttled = _.throttle(function () {
            $scope.$apply(function () {
              ngModelCtrl.$setViewValue($element.val());
            });
          }, throttleAmount);

          $element
            .unbind('input keydown change')
            .bind('input keydown change', throttled);
        }
      }
    });
})();