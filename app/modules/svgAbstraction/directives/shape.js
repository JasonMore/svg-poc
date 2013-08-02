(function () {
  angular.module('svgAbstraction.directives')
    .directive('ngShape', function ($compile, $timeout, pathService) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          model: '=',
          draggable: '=',
          whenClick: '&'
        },
        link: function ($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController;

          var pathDefinition = createPathDefinition($scope, ngSvg);
          var parentGroup = drawShape(pathDefinition, $scope, ngSvg);

          $compile(pathDefinition)($scope);
          $compile(parentGroup)($scope);

          $scope.model.svgElementPath = pathDefinition;
          $scope.model.svgElement = parentGroup;

          setMidpointOfShape($scope, pathDefinition);

          // attach svg element to dom element so we can access it from other directives
          element.data('parentGroup', parentGroup);

          $scope.$on("$destroy", function () {
            ngSvg.svg.remove(parentGroup);
          });
        }
      };

      function createPathDefinition($scope, ngSvg) {
        var path = ngSvg.svg.path(ngSvg.paths, '', {
          'id': '{{model.id}}',

          // stroke width is needed on the def so other calculations work correctly
          'stroke-width': '{{model.borderWidth}}',
//          'class': 'shape',
//          'fill': '{{model.backgroundColor}}',

          // not sure why "d" is the only one that needs ng-attr
          // jquery.svg throws error without "ng-attr"
          'ng-attr-d': '{{model.path}}'
        });

        return path;
      }

      function drawShape(pathDefinition, $scope, ngSvg) {
        // HACK

//        $scope.model.midPointX = 0;
//        $scope.model.midPointY = 0;

        // if drawing image, calculate path
        if ($scope.model.image) {

          if (!$scope.model.width && !$scope.model.height) {
            var width,
              height,
              img = new Image();

            img.onload = function () {
              width = this.width;
              height = this.height;

              $scope.$apply(function () {
                $scope.model.path = _.template('M0,0L${width},0L${width},${height}L0,${height}z', {
                  width: width,
                  height: height
                });
              });
            };

            img.src = $scope.model.image.url;
          } else {
            $scope.model.path = _.template('M0,0L${width},0L${width},${height}L0,${height}z', {
              width: $scope.model.width,
              height: $scope.model.height
            });
          }


        }

        var transform = [
          'translate({{model.left}},{{model.top}})',
          'rotate({{model.rotation}},{{model.midPointX}},{{model.midPointY}})'
        ];

        var parentGroup = ngSvg.svg.group(ngSvg.shapeGroup, {
          transform: transform.join(', ')
        });

        var shapeBackground = ngSvg.svg.use(parentGroup, '{{ "#" + model.id}}', {
          'class': 'shape',
          'fill': '{{model.backgroundColor}}',
          'ng-mousedown': 'whenClick()'

          // not sure why "d" is the only one that needs ng-attr
          // jquery.svg throws error without "ng-attr"
//          'ng-attr-d': '{{model.path}}'
        });

        var image = ngSvg.svg.image(parentGroup, 0, 0, 0, 0, '{{ model.image.url }}', {
//          'ng-attr-x': '{{model.image ? model.image.x : 0}}'
//          'ng-attr-y': '{{model.image ? model.image.y : 0}}',
          'ng-attr-width': '{{model.image ? model.width : 0}}',
          'ng-attr-height': '{{model.image ? model.height : 0}}',
//          'xlink:href' : '{{model.image ? model.image.url : ""}}',
//          'ng-show':'{{model.image}}'
//          'x': '{{ model.image.x}}'
//          'y': '{{ model.image.y }}',
//          'width': '{{model.image.width }}',
//          'height': '{{model.image.height }}',
//          'href' : '{{ model.image.url }}',
//          'ng-show':'{{model.image}}'
          'ng-mousedown': 'whenClick()'
        });

        var shapeForeground = ngSvg.svg.use(parentGroup, '{{"#" + model.id}}', {
          'class': 'shape',
          'fill': 'none',
          'stroke': '{{model.borderColor}}',
          'stroke-width': '{{model.borderWidth}}',
          'ng-mousedown': 'whenClick()'

          // not sure why "d" is the only one that needs ng-attr
          // jquery.svg throws error without "ng-attr"
//          'ng-attr-d': '{{model.path}}'
        });

//        setMidpointOfShape($scope, shapeForeground);

        return parentGroup;
      }

      function setMidpointOfShape($scope, shape) {
        // shape needs to be rendered before we can calculate its midpoint
        $timeout(function () {
          var selectionBox = pathService.getSelectionBox(shape);
          $scope.model.midPointX = (selectionBox.width - $scope.model.borderWidth) / 2;
          $scope.model.midPointY = (selectionBox.height - $scope.model.borderWidth) / 2;
        });
      }
    });
})();