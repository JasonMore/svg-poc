(function () {
  // wrap jquery svg draw methods which produce errors with angular
  angular.module('svgAbstraction.directives')
    .directive('ngShape', function ($compile, $timeout, pathService, elementLookup) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          viewModel: '=',
          draggable: '=',
          whenClick: '&'
        },
        link: function ($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController;

          var pathDefinition = createPathDefinition($scope, ngSvg);
          var parentGroup = drawShape($scope, ngSvg);

          $compile(pathDefinition)($scope);
          $compile(parentGroup)($scope);

          $scope.viewModel.svgElementPath = pathDefinition;
          $scope.viewModel.svgElement = parentGroup;

          if (!$scope.viewModel.midPointX || !$scope.viewModel.midPointY) {
            setMidpointOfShape($scope, pathDefinition);
          }

          // attach svg element to dom element so we can access it from other directives
          element.data('parentGroup', parentGroup);

          $scope.$watch('viewModel.model.image.url', function(url, oldVal){
            if(url === oldVal){
              return;
            }

            calculateImageHeightWidth($scope);
          });

          $scope.$on("$destroy", function () {
            ngSvg.svg.remove(pathDefinition);
            ngSvg.svg.remove(parentGroup);
          });
        }
      };

      function createPathDefinition($scope, ngSvg) {
        var id = $scope.viewModel.model.id + '_clipPath';
        var clipPathParent = ngSvg.svg.clipPath(ngSvg.paths, id);

        var path = ngSvg.svg.path(clipPathParent, '', {
          'id': '{{viewModel.model.id}}',

          // stroke width is needed on the def so other calculations work correctly
          'stroke-width': '{{viewModel.model.borderWidth}}',

          // not sure why "d" is the only one that needs ng-attr
          // jquery.svg throws error without "ng-attr"
          'ng-attr-d': '{{viewModel.model.path}}'
        });

        return path;
      }

      function drawShape($scope, ngSvg) {
        var transform = [
          'translate({{viewModel.model.left}},{{viewModel.model.top}})',
          'rotate({{viewModel.model.rotation}},{{viewModel.midPointX}},{{viewModel.midPointY}})'
        ];

        var parentGroup = ngSvg.svg.group(ngSvg.shapeGroup, {
          transform: transform.join(', ')
//          'clip-path': 'url({{"#" + viewModel.model.id + "_clipPath"}})'
        });

        var shapeBackground = ngSvg.svg.use(parentGroup, '', {
          'ng-href': '{{ "#" + viewModel.model.id}}',
          'class': 'shape',
          'fill': '{{viewModel.model.backgroundColor}}',
          'ng-mousedown': 'whenClick()'
        });

        var image = ngSvg.svg.image(parentGroup, 0, 0, 0, 0, '', {
          'ng-href': '{{ viewModel.model.image.url }}',
          'ng-attr-x': '{{viewModel.model.image ? viewModel.model.image.left : 0}}',
          'ng-attr-y': '{{viewModel.model.image ? viewModel.model.image.top : 0}}',
          'ng-attr-width': '{{viewModel.model.image ? viewModel.model.image.width : 0}}',
          'ng-attr-height': '{{viewModel.model.image ? viewModel.model.image.height : 0}}',
          'ng-mousedown': 'whenClick()',
          'clip-path': 'url({{"#" + viewModel.model.id + "_clipPath"}})'
        });

        var shapeForeground = ngSvg.svg.use(parentGroup, '', {
          'ng-href': '{{ "#" + viewModel.model.id}}',
          'class': 'shape',
          'fill': 'none',
          'stroke': '{{viewModel.model.borderColor}}',
          'stroke-width': '{{viewModel.model.borderWidth}}',
          'ng-mousedown': 'whenClick()'
        });

        return parentGroup;
      }

      function calculateImageHeightWidth($scope) {
        // if drawing image, calculate path
        if (!$scope.viewModel.model.image.url) {
          return;
        }

//        if (!$scope.viewModel.width && !$scope.viewModel.height) {
          var width,
            height,
            img = new Image();

          img.onload = function () {
            width = this.width;
            height = this.height;

            $scope.$apply(function () {
//              $scope.viewModel.model.path = _.template('M0,0L${width},0L${width},${height}L0,${height}z', {
//                width: width,
//                height: height
//              });
              $scope.viewModel.model.image.width = width;
              $scope.viewModel.model.image.height = height;
            });
          };

          img.src = $scope.viewModel.model.image.url;
//        } else {
//          $scope.viewModel.model.path = _.template('M0,0L${width},0L${width},${height}L0,${height}z', {
//            width: $scope.viewModel.width,
//            height: $scope.height
//          });
//        }

      }

      function setMidpointOfShape($scope, shape) {
        // shape needs to be rendered before we can calculate its midpoint
        $timeout(function () {
          var selectionBox = pathService.getSelectionBox(shape);
          $scope.viewModel.width = selectionBox.width;
          $scope.viewModel.height = selectionBox.height;
          $scope.viewModel.midPointX = (selectionBox.width - $scope.viewModel.model.borderWidth) / 2;
          $scope.viewModel.midPointY = (selectionBox.height - $scope.viewModel.model.borderWidth) / 2;
        });
      }
    });
})();