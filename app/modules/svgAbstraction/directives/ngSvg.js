(function () {
  angular.module('svgAbstraction.directives')
    .directive('ngSvg', function ($compile) {
      return {
        restrict: 'E',
        scope: true,
        transclude: true,
        replace: true,
        template: '<div ng-transclude></div>',
        controller: function ($scope, $element) {
          var self = this;

          // yes, belongs in link, but easier here
          $element.svg({onLoad: function (svg) {
            self.svg = svg;
          }});
        }
      };
    });
})();