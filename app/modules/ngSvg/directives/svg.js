(function () {
  angular.module('ngSvg.directives')
    .directive('svg', function () {
      return {
        restrict: "E",
        replace: true,
        transclude: false,
        compile: function (element, attrs) {
          var newElement;

          element.svg({onLoad: function (svg) {
            element.replaceWith(svg._svg);
          }});

          return function link(scope, element, attrs, controller) {
          };
        }
      };
    });
})();