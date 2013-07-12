(function () {
  angular.module('svgAbstraction.directives')
    .directive('drawingSurface', function () {
      return {
        restrict: 'E',
//        template: '<div style="border:1px; width: 100%; height: 300px;"></div>',
        replace: 'true',
//        require:['^svg'],
        controller: function drawingSurfaceCtrl($scope){
        },
        compile: function drawingSurfaceCompile(element, attr) {
//          console.log(element, attr, svg);

          return function drawingSurfacePostLink(scope, element, iAttrs, controller) {
            console.log(scope, element, attr, controller);

            scope.$watch('svg', function(value){
              console.log('found svg', value);
              var svg = value;

              var template =  svg.rect(0, 0, '100%', '100%', {
                id: 'surface',
                fill: 'white',
                stroke: 'black',
                'stroke-width': 4
              });
            });
          }

        }
      }
    })
  ;
})();