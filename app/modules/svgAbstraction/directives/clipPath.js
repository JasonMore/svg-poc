(function () {
  angular.module('svgAbstraction.directives')
    .directive('clipPath', function ($compile, $timeout, pathService) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          model: '='
        },
        link: function ($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController;
        }
      };
    });
})();