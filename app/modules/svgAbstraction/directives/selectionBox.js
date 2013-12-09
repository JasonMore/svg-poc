(function () {
  var rotatorLineLength = 20;

  angular.module('svgAbstraction.directives')
    .directive('selectionBox', function ($compile, pathService, shapeViewModelService) {
      return {
        require: '^ngSvg',
        scope:{
          selectedShape:'=selectionBox'
        },
        link: function ($scope, $element, attr, ngSvgController) {
          var ngSvg = ngSvgController,
            selection = getSelectionBox($element);

          attachResizeBindings(selection.corners, $scope, ngSvg.svg);
          attachRotateBindings(selection.rotator, $scope, ngSvg.svg);
          attachImageResizeBindings(selection.imageCorners, $scope, ngSvg.svg);
          attachImageRotateBindings(selection.imageRotator, $scope, ngSvg.svg);

          $scope.$watch('selectedShape', function(viewModel, old){
            $scope.shadowShape = _.cloneDeep(viewModel);
          });
        }
      };

      function getSelectionBox($element) {

        return {
          box: $element.find('g.selection'),
          corners: $element.find('g.selection circle.corner'),
          rotator: $element.find('g.selection circle.rotator'),
          imageBox: $element.find('g.imageSelection'),
          imageCorners: $element.find('g.imageSelection circle.corner'),
          imageRotator: $element.find('g.imageSelection circle.rotator')
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

            var angle = $scope.shadowShape.model.rotation,
              parentGroup = rotator.parent()[0];

            var drag = getDragOffset(event);
            var pt = convertScreenToElementCoordinates(parentGroup, drag, svg);

            // ref point is height/2, -20
            var cx = $scope.shadowShape.width() / 2;
            var cy = $scope.shadowShape.height() / 2;

            var newAngle = getAngle({x: pt.x, y: pt.y},
              {x: cx, y: -20},
              {x: cx, y: cy});

            angle = (angle + newAngle) % 360;

            if (!event.shiftKey) {
              angle = Math.floor(angle / 15) * 15;
            }

            $scope.$apply(function () {
              $scope.shadowShape.isResizing = true;
              $scope.shadowShape.model.rotation = angle;
            });
          },
          stop: function () {
            $scope.$apply(function () {
              $scope.shadowShape.isResizing = false;
            });
          }
        });
      }

      function attachImageRotateBindings(rotator, $scope, svg) {
        rotator.draggable({
          start: draggableStart,
          drag: function (event, ui) {

            var angle = $scope.shadowShape.model.image.rotation,
              parentGroup = rotator.parent()[0];

            var drag = getDragOffset(event);
            var pt = convertScreenToElementCoordinates(parentGroup, drag, svg);

            // ref point is height/2, -20
            var cx = $scope.shadowShape.imageWidth() / 2;
            var cy = $scope.shadowShape.imageHeight() / 2;

            var newAngle = getAngle({x: pt.x, y: pt.y},
              {x: cx, y: -20},
              {x: cx, y: cy});

            angle = (angle + newAngle) % 360;

            if (!event.shiftKey) {
              angle = Math.floor(angle / 15) * 15;
            }

            $scope.$apply(function () {
              $scope.shadowShape.isResizing = true;
              $scope.shadowShape.model.image.rotation = angle;
            });
          },
          stop: function () {
            $scope.$apply(function () {
              $scope.shadowShape.isResizing = false;
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
            var viewModel = $scope.shadowShape;
            var rawElement = $scope.shadowShape.svgElementParentGroup;
            var selectionBoxGroup = draggedCorner.parent()[0];
            var baselineOrigin = convertBaselineToSVG(selectionBoxGroup);
            var drag = getDragOffset(event);
            var currentDimensions = {width: $scope.shadowShape.width(), height: $scope.shadowShape.height()};
            var newDim = getNewShapeLocationAndDimensions(svg, draggedCorner, drag, currentDimensions);

            $scope.$apply(function () {
              viewModel.width(newDim.width - viewModel.borderOffset());
              viewModel.height(newDim.height - viewModel.borderOffset());
            });

            var conversion = convertDeltasToSVG(selectionBoxGroup, baselineOrigin, newDim.deltaX, newDim.deltaY);
            var translation = getTranslation(rawElement, conversion.deltaX, conversion.deltaY, true);
            var scaleX = (newDim.width) / (currentDimensions.width);
            var scaleY = (newDim.height) / (currentDimensions.height);

//            console.log(scaleY, newDim);

            var shapePath = $scope.shadowShape.svgElementPath;
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
              $scope.shadowShape.isResizing = false;
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
            var vm = $scope.shadowShape;
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
              $scope.shadowShape.isResizing = false;
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

        if(width < 10){
          width = 10;
          deltaX = 0;
        }

        if(height < 10){
          height = 10;
          deltaY = 0;
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