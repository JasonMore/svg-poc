(function () {
  angular.module('svgAbstraction.directives')
  .directive('square', function($compile){
    return {
      restrict: 'E',
      require: '^ngSvg',
      scope: {
        x: '=',
        y: '='
      },
      link: function(scope, element, attr, controller){
        var rect = controller.svg.rect(20, 50, 100, 50, {
          'ng-attr-fill': '{{"green"}}',
          'ng-attr-x': '{{x}}',
          'ng-attr-y': '{{y}}',
          stroke: 'navy',
          strokeWidth: 5});

        $compile(rect)(scope);

        scope.$on("$destroy",function() {
          controller.svg.remove(rect);
        });
      }
    };
  });
})();