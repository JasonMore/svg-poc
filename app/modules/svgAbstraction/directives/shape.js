(function () {
  angular.module('svgAbstraction.directives')
    .directive('shape', function () {
      return {
        restrict: 'E',
//        template: '<div style="border:1px; width: 100%; height: 300px;"></div>',
//        replace: 'true',
        compile: function shapeCompile(element, attr) {
//          console.log(element, attr, svg);

          return function shapePostLink(scope, element, iAttrs, controller) {
            console.log(scope, element, attr, controller);

            scope.$watch('svg', function(value){
              console.log('found svg', value);
              var svg = value;

              var parentGroup = svg.group({
//                transform: _.template(transform, {
//                  left: left,
//                  top: top,
//                  halfWidth: halfWidth,
//                  halfHeight: halfHeight
//                })
              });

              svg.path(parentGroup, svg.createPath()
                .move(0, 0)
                .line(width, 0)
                .line(width, height)
                .line(0, height)
                .close(), settings);
            });
          }

        }
      }
    })
  ;
})();