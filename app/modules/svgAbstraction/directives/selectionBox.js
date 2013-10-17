(function () {
  var rotatorLineLength = 20;

  angular.module('svgAbstraction.directives')
    .directive('selectionBox', function ($compile, pathService) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          viewModel: '='
        },
        link: function ($scope, element, attr, ngSvgController) {
          ;
          var ngSvg = ngSvgController,
            selection = createSelectionBox(ngSvg);

          attachResizeBindings(selection.corners, $scope, ngSvg.svg);
          attachRotateBindings(selection.rotator, $scope, ngSvg.svg);

          attachImageResizeBindings(selection.imageCorners, $scope, ngSvg.svg);
          attachImageRotateBindings(selection.imageRotator, $scope, ngSvg.svg);

          $compile(selection.box)($scope);
          $compile(selection.imageBox)($scope);
          addScopeMethods($scope);
        }
      };

      function addScopeMethods($scope) {
        $scope.calcImageLeft = function () {
          var vm = $scope.viewModel;
          return vm ? vm.imageLeft() + vm.left() + vm.borderOffset() : 0;
        };

        $scope.calcImageTop = function () {
          var vm = $scope.viewModel;
          return vm ? vm.imageTop() + vm.top() + vm.borderOffset() : 0;
        };

        $scope.calcImageRotation = function () {
          var vm = $scope.viewModel;
          return vm ? vm.model.image.rotation + vm.model.rotation : 0;
        };

        $scope.imageHeight = function () {
          var vm = $scope.viewModel;

          if (!$scope.viewModel || !$scope.viewModel.model.image) {
            return 0;
          }

          return $scope.viewModel.model.image.height;
        };
      }

      function createSelectionBox(ngSvg) {
        var selectionBox = drawSelectionBox(ngSvg);
        var handles = drawSelectionCorners(ngSvg.svg, selectionBox);

        var imageSelectionBox = drawImageSelectionBox(ngSvg);
        var imageHandles = drawImageSelectionCorners(ngSvg.svg, imageSelectionBox);

        return {
          box: selectionBox,
          corners: handles.corners,
          rotator: handles.rotator,
          imageBox: imageSelectionBox,
          imageCorners: imageHandles.corners,
          imageRotator: imageHandles.rotator
        };
      }

      function drawSelectionBox(ngSvg) {
        var transform = [
          'translate({{viewModel.left()}},{{viewModel.top()}})',
          'rotate({{viewModel.model.rotation}},{{viewModel.midPointX()}},{{viewModel.midPointY()}})'
        ];

        var selectionBox = ngSvg.svg.group(ngSvg.selectionGroup, {
          transform: transform.join(', '),
          'ng-show': 'viewModel && !viewModel.showPreviewImage',
          class: 'noTextWrap'
        });

        ngSvg.svg.path(selectionBox, '', {
          'ng-attr-d': 'M0,0L{{viewModel.width()}},0L{{viewModel.width()}},{{viewModel.height()}}L0,{{viewModel.height()}}z',
          fill: 'none',
          fillOpacity: '0.3',
          'stroke-dasharray': '5,5',
          stroke: '#0096fd',
          strokeWidth: 2,
          class: 'noTextWrap'
        });

        return selectionBox;
      }

      function drawImageSelectionBox(ngSvg) {
        var transform = [
          'translate({{calcImageLeft()}},{{calcImageTop()}})',
          'rotate({{calcImageRotation()}},{{viewModel.imageMidPointX()}},{{viewModel.imageMidPointY()}})'
        ];

        var selectionBox = ngSvg.svg.group(ngSvg.selectionGroup, {
          transform: transform.join(', '),
          'ng-show': 'viewModel.showPreviewImage',
          class: 'noTextWrap'
        });

        var imageSelectionPath = [
          'M0,0',
          'L{{viewModel.imageWidth()}},0',
          'L{{viewModel.imageWidth()}},{{viewModel.imageHeight()}}',
          'L0,{{viewModel.imageHeight()}}',
          'z'
        ];

        ngSvg.svg.path(selectionBox, '', {
          'ng-attr-d': imageSelectionPath.join(''),
          fill: 'none',
          fillOpacity: '0.3',
          'stroke-dasharray': '5,5',
          stroke: '#0096fd',
          strokeWidth: 2,
          class: 'noTextWrap'
        });

        return selectionBox;
      }

      function drawSelectionCorners(svg, selectionBox) {
        var defaultCircleSettings = {
          class_: 'corner noTextWrap',
          fill: '#0096fd',
          'stroke-width': 1,
          stroke: 'white'
        };

        var cornerNW = svg.circle(selectionBox, 0, 0, 5, _.extend({
          'data-cornerid': 'cornerNW',
          transform: 'translate(0,0)'
        }, defaultCircleSettings));

        var cornerNE = svg.circle(selectionBox, 0, 0, 5, _.extend({
          'data-cornerid': 'cornerNE',
          transform: 'translate({{viewModel.width()}},0)'
        }, defaultCircleSettings));

        var cornerSE = svg.circle(selectionBox, 0, 0, 5, _.extend({
          'data-cornerid': 'cornerSE',
          transform: 'translate({{viewModel.width()}},{{viewModel.height()}})'
        }, defaultCircleSettings));

        var cornerSW = svg.circle(selectionBox, 0, 0, 5, _.extend({
          'data-cornerid': 'cornerSW',
          transform: 'translate(0,{{viewModel.height()}})'
        }, defaultCircleSettings));

        svg.line(selectionBox, 0, 0, 0, (-1 * rotatorLineLength), {
          stroke: '#0096fd',
          strokeWidth: 3,
          transform: 'translate({{viewModel.midPointX()}},0)',
          class: 'noTextWrap'
        });

        var rotator = svg.circle(selectionBox, 0, 0, 5, _.extend({
          'data-cornerid': 'rotator',
          class_: 'rotator noTextWrap',
          fill: '#FFFFFF',
          stroke: '#0096fd',
          strokeWidth: 1,
          transform: 'translate({{viewModel.midPointX()}},-20)'
        }, defaultCircleSettings));

        return {
          corners: angular.element([cornerNW, cornerNE, cornerSE, cornerSW]),
          rotator: angular.element(rotator)
        };
      }

      function drawImageSelectionCorners(svg, selectionBox) {
        var defaultCircleSettings = {
          class_: 'corner',
          fill: '#0096fd',
          'stroke-width': 1,
          stroke: 'white'
        };

        var cornerNW = svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          'data-cornerid': 'cornerNW',
          transform: 'translate(0,0)'
        }));

        var cornerNE = svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          'data-cornerid': 'cornerNE',
          transform: 'translate({{viewModel.imageWidth()}},0)'
        }));

        var cornerSE = svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          'data-cornerid': 'cornerSE',
          transform: 'translate({{viewModel.imageWidth()}},{{viewModel.imageHeight()}})'
        }));

        var cornerSW = svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          'data-cornerid': 'cornerSW',
          transform: 'translate(0,{{viewModel.imageHeight()}})'
        }));

        svg.line(selectionBox, 0, 0, 0, (-1 * rotatorLineLength), {
          stroke: '#0096fd',
          strokeWidth: 3,
          transform: 'translate({{viewModel.imageMidPointX()}},0)'
        });

        var rotator = svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          'data-cornerid': 'rotator',
          class_: 'rotator',
          fill: '#FFFFFF',
          stroke: '#0096fd',
          strokeWidth: 1,
          transform: 'translate({{viewModel.imageMidPointX()}},-20)'
        }));

        return {
          corners: angular.element([cornerNW, cornerNE, cornerSE, cornerSW]),
          rotator: angular.element(rotator)
        };
      }

      var offset, start;

      function draggableStart(event) {
        offset = {
          left: document.documentElement.scrollLeft || document.body.scrollLeft,
          top: document.documentElement.scrollTop || document.body.scrollTop
        };

        start = {
          x: event.pageX - offset.left,
          y: event.pageY - offset.top
        };
      }

      function attachRotateBindings(rotator, $scope, svg) {
        rotator.draggable({
          start: draggableStart,
          drag: function (event, ui) {

            var angle = $scope.viewModel.model.rotation,
              parentGroup = rotator.parent()[0];

            var drag = getDragOffset(event);
            var pt = convertScreenToElementCoordinates(parentGroup, drag, svg);

            // ref point is height/2, -20
            var cx = $scope.viewModel.width() / 2;
            var cy = $scope.viewModel.height() / 2;

            var newAngle = getAngle({x: pt.x, y: pt.y},
              {x: cx, y: -20},
              {x: cx, y: cy});

            angle = (angle + newAngle) % 360;

            if (!event.shiftKey) {
              angle = Math.floor(angle / 15) * 15;
            }

            $scope.$apply(function () {
              $scope.viewModel.isResizing = true;
              $scope.viewModel.model.rotation = angle;
            });
          },
          stop: function () {
            $scope.$apply(function () {
              $scope.viewModel.isResizing = false;
            });
          }
        });
      }

      function attachImageRotateBindings(rotator, $scope, svg) {
        rotator.draggable({
          start: draggableStart,
          drag: function (event, ui) {

            var angle = $scope.viewModel.model.image.rotation,
              parentGroup = rotator.parent()[0];

            var drag = getDragOffset(event);
            var pt = convertScreenToElementCoordinates(parentGroup, drag, svg);

            // ref point is height/2, -20
            var cx = $scope.viewModel.imageWidth() / 2;
            var cy = $scope.viewModel.imageHeight() / 2;

            var newAngle = getAngle({x: pt.x, y: pt.y},
              {x: cx, y: -20},
              {x: cx, y: cy});

            angle = (angle + newAngle) % 360;

            if (!event.shiftKey) {
              angle = Math.floor(angle / 15) * 15;
            }

            $scope.$apply(function () {
              $scope.viewModel.isResizing = true;
              $scope.viewModel.model.image.rotation = angle;
            });
          },
          stop: function () {
            $scope.$apply(function () {
              $scope.viewModel.isResizing = false;
            });
          }
        });
      }

      function convertScreenToElementCoordinates(selectionBoxGroup, drag, svg) {
        var matrix = selectionBoxGroup.getScreenCTM().inverse();

        // convert screen to element coordinates
        var pt = svg._svg.createSVGPoint();
        pt.x = drag.x;
        pt.y = drag.y;
        pt = pt.matrixTransform(matrix);
        return pt;
      }

      function getAngle(ptA, ptB, ptC) {
        var a = dist(ptB, ptC);
        var b = dist(ptA, ptC);
        var c = dist(ptA, ptB);
        var radians = getAngleABC(a, b, c);
        var degrees = 57.2957795 * radians;

        if (ptA.x < ptB.x) {
          degrees = -degrees;
        }
        return degrees;
      }

      function getAngleABC(a, b, c) {
        var t = (a * a + b * b - c * c) / (2 * a * b);
        return Math.acos(t);
      }

      function dist(pt1, pt2) {
        return Math.sqrt(Math.pow(pt1.x - pt2.x, 2.0) + Math.pow(pt1.y - pt2.y, 2.0));
      }

      function attachResizeBindings(selectionCorners, $scope, svg) {
        selectionCorners.draggable({
          start: draggableStart,
          drag: function (event, ui) {

            var draggedCorner = $(this);
            var viewModel = $scope.viewModel;
            var rawElement = $scope.viewModel.svgElement;
            var selectionBoxGroup = draggedCorner.parent()[0];
            var baselineOrigin = convertBaselineToSVG(selectionBoxGroup);
            var drag = getDragOffset(event);
            var currentDimensions = {width: $scope.viewModel.width(), height: $scope.viewModel.height()};
            var newDim = getNewShapeLocationAndDimensions(svg, draggedCorner, drag, currentDimensions);
            var borderWidth = $scope.viewModel.model.borderWidth;

            $scope.$apply(function () {
              viewModel.width(newDim.width - viewModel.borderOffset());
              viewModel.height(newDim.height - viewModel.borderOffset());
            });

            var conversion = convertDeltasToSVG(selectionBoxGroup, baselineOrigin, newDim.deltaX, newDim.deltaY);
            var translation = getTranslation(rawElement, conversion.deltaX, conversion.deltaY, true);
            var scaleX = (newDim.width) / (currentDimensions.width);
            var scaleY = (newDim.height) / (currentDimensions.height);
            var shapePath = $scope.viewModel.svgElementPath;
            var newShapePath = rescaleElement(shapePath, scaleX, scaleY);

            $scope.$apply(function () {
              viewModel.isResizing = true;
              viewModel.model.top = translation.y;
              viewModel.model.left = translation.x;
              viewModel.model.path = newShapePath;

              if (viewModel.model.image.url) {
                var image = viewModel.model.image;
                image.left = image.left * scaleX;
                image.top = image.top * scaleY;
                image.width = image.width * scaleX;
                image.height = image.height * scaleY;
              }
            });
          },
          stop: function () {
            $scope.$apply(function () {
              $scope.viewModel.isResizing = false;
            });
          }
        });

        function convertBaselineToSVG(selectionBoxGroup) {
          var ptA = svg._svg.createSVGPoint();
          ptA.x = 0;
          ptA.y = 0;

          var ptB = ptA.matrixTransform(selectionBoxGroup.getCTM());

          return {
            x: ptB.x,
            y: ptB.y
          };
        }

        function convertDeltasToSVG(selectionBoxGroup, baselineOrigin, deltaX, deltaY) {
          var pt2 = svg._svg.createSVGPoint();
          pt2.x = deltaX;
          pt2.y = deltaY;
          pt2 = pt2.matrixTransform(selectionBoxGroup.getCTM());

          deltaX = baselineOrigin.x - pt2.x;
          deltaY = baselineOrigin.y - pt2.y;

          return {
            deltaX: deltaX,
            deltaY: deltaY
          };
        }

        function rescaleElement(element, scaleX, scaleY) {
          return pathService.transformShape(svg, element, scaleX, scaleY, 0, 0);
        }

        function getTranslation(elt, x, y, isRelative) {
          if (!elt.transform.baseVal.numberOfItems) {
            return;
          }

          // make sure transform 1 is a translate transform
          var trans = elt.transform.baseVal.getItem(0);
          if (trans.type !== 2) {
            return { };
          }

          if (isRelative) {
            var origX = trans.matrix.e;
            var origY = trans.matrix.f;

            x += origX;
            y += origY;
          }

          return {
            x: x,
            y: y
          };
        }
      }

      function attachImageResizeBindings(selectionCorners, $scope, svg) {
        selectionCorners.draggable({
          start: draggableStart,
          drag: function (event, ui) {

            var draggedCorner = $(this);
            var vm = $scope.viewModel;
            var drag = getDragOffset(event);
            var currentDimensions = {width: vm.imageWidth(), height: vm.imageHeight()};
            var newDim = getNewShapeLocationAndDimensions(svg, draggedCorner, drag, currentDimensions);

            $scope.$apply(function () {
              vm.model.image.width = newDim.width;
              vm.model.image.height = newDim.height;
              vm.model.image.top = vm.model.image.top - newDim.deltaY;
              vm.model.image.left = vm.model.image.left - newDim.deltaX;
            });
          },
          stop: function () {
            $scope.$apply(function () {
              $scope.viewModel.isResizing = false;
            });
          }
        });
      }

      function getNewShapeLocationAndDimensions(svg, draggedCorner, drag, currentDimensions) {
        var selectionBoxGroup = draggedCorner.parent()[0];
        var pt = convertScreenToElementCoordinates(selectionBoxGroup, drag, svg);
        var cornerId = draggedCorner.data('cornerid'),
          deltaX = 0,
          deltaY = 0,
          width = currentDimensions.width,
          height = currentDimensions.height;

        if (cornerId == 'cornerNW') {
          deltaX = -pt.x;
          deltaY = -pt.y;
          width = width - pt.x;
          height = height - pt.y;
        } else if (cornerId == 'cornerNE') {
          deltaY = -pt.y;
          width = pt.x;
          height = height - pt.y;
        } else if (cornerId == 'cornerSE') {
          width = pt.x;
          height = pt.y;
        } else if (cornerId == 'cornerSW') {
          deltaX = -pt.x;
          width = width - pt.x;
          height = pt.y;
        }

        return {
          deltaX: deltaX,
          deltaY: deltaY,
          width: width,
          height: height
        }
      }

      function getDragOffset(event) {
        return {
          x: event.pageX - offset.left,
          y: event.pageY - offset.top
        };
      }
    }

  )
  ;
})();