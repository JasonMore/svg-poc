(function () {
  angular.module('svg-poc')
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