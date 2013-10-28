(function () {
  // wrap jquery svg draw methods which produce errors with angular
  angular.module('svgAbstraction.directives')
    .directive('ngShape', function ($compile, $timeout, pathService) {
      return {
//        restrict: 'E',
        require: '^ngSvg',
//        template: '<div fooId="{{viewModel.model.id}}" fooOrder="{{viewModel.model.order}}"></div>',
//        replace: true,
//        scope: {
//          viewModel: '=',
//          draggable: '=',
//          whenClick: '&'
//        },
        link: function ($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController;

//          var pathDefinition = createPathDefinition($scope, ngSvg);
//          var shape = drawShape($scope, ngSvg);

//          $compile(pathDefinition)($scope);
//          $compile(shape.parentGroup)($scope);

          $timeout(function() {
            $scope.viewModel.svg = ngSvg.svg;
            $scope.viewModel.svgElementPath = angular.element('#' + $scope.viewModel.id())[0];
            $scope.viewModel.svgElement = element[0];
            $scope.viewModel.svgText = element.find('text')[0];
          })

//          $scope.viewModel.svg = ngSvg.svg;
//          $scope.viewModel.svgElementPath = angular.element('#' + $scope.viewModel.id())[0];
//          $scope.viewModel.svgElement = element;
//          $scope.viewModel.svgText = element.find('text');

//          $scope.viewModel.svgElementPath = pathDefinition;
//          $scope.viewModel.svgElement = shape.parentGroup;
//          $scope.viewModel.svgText = shape.text;

          // attach svg element to dom element so we can access it from other directives
//          element.data('parentGroup', shape.parentGroup);

          $scope.$watch('viewModel.model.image.url', function (url, oldVal) {
            if (url === oldVal) {
              return;
            }

            calculateImageHeightWidth($scope);
          });

//          $scope.$watch('viewModel.model.order', function (newOrder, oldOrder) {
//            if (newOrder === oldOrder) return;
//
//            var el = angular.element($scope.viewModel.svgElement);
//
//            if (el.data('order') === newOrder) return;
//
//
//            if (newOrder > oldOrder) {
//              //hacks
//              // insertAfter oldOrder, because thats what the new spot current si
//              el.insertAfter(angular.element('g[data-order=' + newOrder + ']'));
//            } else if (newOrder < oldOrder) {
//              // insertBefore oldOrder
//              el.insertBefore(angular.element('g[data-order=' + newOrder + ']'));
//            }
//
//            el.data('order', newOrder);
//
//          });

//          $scope.$on("$destroy", function () {
//            ngSvg.svg.remove(pathDefinition);
//            ngSvg.svg.remove(shape.parentGroup);
//          });

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
          transform: transform.join(', '),
          'data-order':$scope.viewModel.model.order,
          'data-id': '{{viewModel.model.id}}'
        });

        var shapeBackground = ngSvg.svg.use(parentGroup, '', {
          'ng-href': '{{"#" + viewModel.model.id}}',
          'fill': '{{viewModel.model.backgroundColor}}',
          'ng-mousedown': 'whenClick()',
          'ng-dblclick': 'viewModel.isEditingText = true',
          'class': '{{viewModel.model.wrapTextAround ? "" : "noTextWrap"}}'
        });

        drawImage($scope, ngSvg, parentGroup);

        var shapeForeground = ngSvg.svg.use(parentGroup, '', {
          'ng-href': '{{ "#" + viewModel.model.id}}',
          'fill': 'none',
          'stroke': '{{viewModel.model.borderColor}}',
          'stroke-width': '{{viewModel.model.borderWidth}}',
          'ng-mousedown': 'whenClick()',
          'ng-dblclick': 'viewModel.isEditingText = true',
          'class': '{{viewModel.model.wrapTextAround ? "" : "noTextWrap"}}'
        });

        var textSpans = ngSvg.svg.createText().string('{{viewModel.model.text}}');

        var text = ngSvg.svg.text(parentGroup, 10, 10, textSpans, {
          opacity: 1,
          'font-family': '{{viewModel.model.font}}',
          'font-size': '{{viewModel.model.fontSize}}',
          fill: '{{viewModel.model.fontColor}}',
          'ng-show': '!viewModel.isEditingText',
          'ng-mousedown': 'whenClick()',
          'ng-dblclick': 'viewModel.isEditingText = true',
          'ng-style': '{cursor:"default"}',
          'class': '{{viewModel.model.wrapTextAround ? "" : "noTextWrap"}}'
        });

        return {
          parentGroup: parentGroup,
          text: text
        };
      }

      function drawImage($scope, ngSvg, parentGroup) {
        var imageBindings = {
          'ng-attr-x': '{{viewModel.imageLeft()}}',
          'ng-attr-y': '{{viewModel.imageTop()}}',
          'ng-attr-width': '{{viewModel.imageWidth()}}',
          'ng-attr-height': '{{viewModel.imageHeight()}}',
          'preserveAspectRatio': 'none',
          'class': '{{viewModel.model.wrapTextAround ? "" : "noTextWrap"}}'
        };

        var previewImageMaskId = $scope.viewModel.makeUrlRef('previewImageMask');

        var previewImageMask = ngSvg.svg.mask(parentGroup, previewImageMaskId, 0, 0, 0, 0, imageBindings);

        var previewImageMaskRect = ngSvg.svg.rect(previewImageMask, 0, 0, 0, 0, _.extend({
          'fill': 'white',
          'opacity': '.4'
        }, imageBindings));

        var imageTransform = [
          'rotate(',
          '{{viewModel.model.image.rotation}},',
          '{{viewModel.imageMidPointX() + viewModel.imageLeft()}},',
          '{{viewModel.imageMidPointY() + viewModel.imageTop()}}',
          ')'
        ];

        var imageGroup = ngSvg.svg.group(parentGroup, {
          'clip-path': 'url({{viewModel.urlRef("clipPath")}})'
        });

        var previewImage = ngSvg.svg.image(parentGroup, 0, 0, 0, 0, '', _.extend({
          'ng-href': '{{ viewModel.model.image.url }}',
          'ng-attr-mask': 'url({{viewModel.urlRef("previewImageMask")}})',
          'transform': imageTransform.join(''),
          'ng-show': 'viewModel.showPreviewImage'
        }, imageBindings));

        var image = ngSvg.svg.image(imageGroup, 0, 0, 0, 0, '', _.extend({
          'ng-href': '{{ viewModel.model.image.url }}',
          'ng-mousedown': 'whenClick()',
          'ng-dblclick': 'viewModel.isEditingText = true',
          'transform': imageTransform.join(''),
          'ng-show': 'viewModel.model.image.url'
        }, imageBindings));
      }

      function calculateImageHeightWidth($scope) {
        // if drawing image, calculate path
        if (!$scope.viewModel.model.image.url) {
          return;
        }

        var width,
          height,
          img = new Image();

        img.onload = function () {
          width = this.width;
          height = this.height;

          $scope.$apply(function () {
            $scope.viewModel.model.image.width = width;
            $scope.viewModel.model.image.height = height;
          });
        };

        img.src = $scope.viewModel.model.image.url;
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