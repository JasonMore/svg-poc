(function () {
  angular.module('svgAbstraction.directives')
    .directive('ngSvg', function () {
      return {
        controller: 'ngSvgController'
      };
    })
    .controller('ngSvgController', function ($scope, $element, $compile) {
      var self = this;

      // yes, belongs in link, but easier here
      $element.svg({onLoad: function (svg) {
        self.svg = svg;
      }});
    })
  ;
})();