(function () {
  angular.module('svgAbstraction.directives')
    .directive('svg', function () {
      return {
        restrict: 'E',
        template: '<div style="border:1px; width: 100%; height: 300px;"></div>',
        //replace: 'true',
//        controller: function($scope){
//          $scope.svg = null;
//        },
        compile: function compile(element, attr, transclude) {
          return {
            pre: function preLink(scope, element, attr, controller) {
              console.log('foo');
//              element.svg({onLoad: function (svg) {
//                scope.svg = svg;
//              }});
            },
            post: function postLink(scope, element, attr, controller) {
              console.log('bar');
              element.svg({onLoad: function (svg) {
                scope.svg = svg;
              }});
            }
          }
        },
//        link: function(scope, element, attr){
//          element.svg({onLoad: function (svg) {
//            scope.svg = svg;
//          }});
//        }
      }
    })
  ;
})();