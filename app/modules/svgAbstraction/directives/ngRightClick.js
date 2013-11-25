(function () {
  angular.module('svgAbstraction.directives')
    .directive('ngRightclick', function ($parse) {
      return function (scope, element, attrs) {
        var fn = $parse(attrs.ngRightclick);
        element.bind('contextmenu', function (event) {
          scope.$apply(function () {
            event.preventDefault();
            fn(scope, {$event: event});
          });
        });
      };
    });
}());