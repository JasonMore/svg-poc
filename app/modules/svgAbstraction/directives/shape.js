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

          // attach svg element to dom element so we can access it from other directives
          element.data('parentGroup', parentGroup);

          $scope.$watch('viewModel.model.image.url', function (url, oldVal) {
            if (url === oldVal) {
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
        var id = $scope.viewModel.makeUrlRef('clipPath');
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
          'rotate({{viewModel.model.rotation}},{{viewModel.midPointX()}},{{viewModel.midPointY()}})'
        ];

        var parentGroup = ngSvg.svg.group(ngSvg.shapeGroup, {
          transform: transform.join(', ')
        });

        var shapeBackground = ngSvg.svg.use(parentGroup, '', {
          'ng-href': '{{"#" + viewModel.model.id}}',
          'class': 'shape',
          'fill': '{{viewModel.model.backgroundColor}}',
          'ng-mousedown': 'whenClick()'
        });

        var imageBindings = {
          'ng-attr-x': '{{viewModel.imageLeft()}}',
          'ng-attr-y': '{{viewModel.imageTop()}}',
          'ng-attr-width': '{{viewModel.imageWidth()}}',
          'ng-attr-height': '{{viewModel.imageHeight()}}',
          'preserveAspectRatio' : 'none'
        };

        var previewImageMaskId = $scope.viewModel.makeUrlRef('previewImageMask');

        var previewImageMask = ngSvg.svg.mask(parentGroup, previewImageMaskId, 0, 0, 0, 0, imageBindings);

        var previewImageMaskRect = ngSvg.svg.rect(previewImageMask, 0, 0, 0, 0, _.extend({
          'fill': 'white',
          'opacity': '.4'
        }, imageBindings));

        var previewImage = ngSvg.svg.image(parentGroup, 0, 0, 0, 0, '', _.extend({
          'ng-href': '{{ viewModel.model.image.url }}',
          'ng-attr-mask': 'url({{viewModel.urlRef("previewImageMask")}})',
          'transform': 'rotate({{viewModel.model.image.rotation}},{{viewModel.imageMidpointX()}},{{viewModel.imageMidpointY()}})',
          'ng-show': 'viewModel.showPreviewImage'
        }, imageBindings));

        var image = ngSvg.svg.image(parentGroup, 0, 0, 0, 0, '', _.extend({
          'ng-href': '{{ viewModel.model.image.url }}',
          'ng-mousedown': 'whenClick()',
          'clip-path': 'url({{viewModel.urlRef("clipPath")}})',
          'transform': 'rotate({{viewModel.model.image.rotation}},{{viewModel.imageMidpointX()}},{{viewModel.imageMidpointY()}})',
          'ng-show':  'viewModel.model.image.url'
        }, imageBindings));

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

        var width,
          height,
          img = new Image(),
          viewModelImage = $scope.viewModel.model.image;

        img.onload = function () {
          width = this.width;
          height = this.height;

          $scope.$apply(function () {
            viewModelImage.width = width;
            viewModelImage.height = height;
          });
        };

        img.src = $scope.viewModel.model.image.url;

        if (!viewModelImage.top || !viewModelImage.left) {
          viewModelImage.top = 0;
          viewModelImage.left = 0;
          viewModelImage.rotation = 0;
        }
      }

      function setShapeWidthHeight($scope, shape) {
        // shape needs to be rendered before we can calculate its midpoint
        $timeout(function () {
          var selectionBox = pathService.getSelectionBox(shape);
          $scope.viewModel.width = selectionBox.width;
          $scope.viewModel.height = selectionBox.height;
        });
      }
    });
})();