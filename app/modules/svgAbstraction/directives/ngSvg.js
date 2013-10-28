(function () {
  angular.module('svgAbstraction.directives')
    .directive('ngSvg', function () {
      return {
//        restrict: 'E',
//        scope: {
//          click: '&'
//        },
//        transclude: true,
//        replace: true,
//        template: '<div ng-transclude></div>',
        controller: 'ngSvgController'
      };
    })
    .controller('ngSvgController', function ($scope, $element, $compile) {
      var self = this;

      // yes, belongs in link, but easier here
      $element.svg({onLoad: function (svg) {
        self.svg = svg;

        // clickable surface
//        svg.rect(0, 0, '100%', '100%', {
//          fill: 'white',
//          'fill-opacity': 0,
//          'ng-click': 'click()'
//        });
//
//        self.paths = svg.defs('paths');
//        self.shapeGroup = svg.group({class: 'shapes'});
//        self.selectionGroup = svg.group({class: 'selection'});
//        self.drawingGroup = svg.group({class: 'drawing'});
//
//        $compile(svg._svg)($scope);
      }});
    })
  ;
})();