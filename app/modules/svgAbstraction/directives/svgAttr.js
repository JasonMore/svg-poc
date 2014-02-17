(function() {
  angular.module('svg-poc')
    .directive('svgAttr', function() {
      return function(scope, el, attr) {
        scope.$watch(function() { return attr.svgAttr; }, function(svgAttr){
          var binding = scope.$eval(svgAttr);
          el[0].setAttribute(binding.name, binding.value);
        });
      }
    });
}());