(function () {
  angular.module('svgAbstraction.directives')
    .directive('ngWrapperClick', function ($parse) {
      return function (scope, element, attr) {
        var fn = $parse(attr['ngWrapperClick']);
        element.bind('click', function (event) {
          if(event.target !== element[0]) return;

          scope.$apply(function () {
            fn(scope, {$event: event});
          });
        });
      };

    })
}());