(function() {
  angular.module('svgAbstraction.directives')
    .directive('svgAttrViewbox', function () {
      return function(scope, el, attr) {
        scope.$watch(function() { return attr.svgAttrViewbox; }, function(val){
          el[0].setAttribute('viewBox', val);
        });
      }
    });
}());

(function() {
  angular.module('svgAbstraction.directives')
    .directive('svgAttrStddeviation', function () {
      return function(scope, el, attr) {
        scope.$watch(function() { return attr.svgAttrStddeviation; }, function(val){
          el[0].setAttribute('stdDeviation', val);
        });
      }
    });
}());