(function() {
  angular.module('svgAbstraction.directives')
    .directive('svgAttr', function() {
      return function(scope, el, attr) {
        scope.$watch(function() { return attr.svgAttr; }, function(svgAttr){
          var binding = scope.$eval(svgAttr);
          el[0].setAttribute(binding.name, binding.value);
        });
      }
    });
}());