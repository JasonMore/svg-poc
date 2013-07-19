(function () {
  angular.module('svgAbstraction.directives')
    .directive('ngSvg', function () {
      return {
        restrict: 'E',
        scope: true,
        transclude: true,
        replace: true,
        template: '<div ng-transclude></div>',
        controller: 'ngSvgController'
      };
    })
    .controller('ngSvgController', function($element) {
      var self = this;

      // yes, belongs in link, but easier here
      $element.svg({onLoad: function (svg) {
        self.svg = svg;

        self.shapeGroup = svg.group();
        self.selectionGroup = svg.group();
      }});
    })
  ;
})();