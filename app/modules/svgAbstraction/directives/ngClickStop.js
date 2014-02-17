///
// Stops propagation of the click from the elements children

(function () {
  angular.module('svg-poc')
    .directive('ngClickStop', function ($parse) {
      return function (scope, element, attr) {
        var fn = $parse(attr['ngClickStop']);
        element.bind('click', function (event) {
          if(event.target !== element[0]) return;

          scope.$apply(function () {
            fn(scope, {$event: event});
          });
        });
      };

    })
}());