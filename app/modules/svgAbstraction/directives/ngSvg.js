(function () {
  angular.module('svg-poc')
    .directive('ngSvg', function () {
      return {
        controller: 'ngSvgController'
      };
    })
    .controller('ngSvgController', function ($scope, $element, svgReferenceService) {
      var self = this;

      // yes, belongs in link, but easier here
      $element.svg({onLoad: function (svg) {
        self.svg = svg;
        svgReferenceService.svg = svg;
      }});
    })
  ;
})();