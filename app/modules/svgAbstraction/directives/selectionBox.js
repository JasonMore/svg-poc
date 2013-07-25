(function () {
  var rotatorLineLength = 20;

  angular.module('svgAbstraction.directives')
    .directive('selectionBox', function ($compile, pathService) {
      return {
        restrict:'E',
        require:'^ngSvg',
        scope:{
          shape:'='
        },
        controller:function ($scope) {
          $scope.width = 0;
          $scope.height = 0;
        },
        link:function ($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController,
            selection = createSelectionBox(ngSvg);

          attachResizeBindings(selection.corners, $scope, ngSvg.svg);

          $compile(selection.box)($scope);
          addScopeMethods($scope, ngSvg);
        }
      };

      function addScopeMethods($scope, ngSvg) {
        $scope.calcLeft = function (shape) {
          return shape ? shape.left - shape.borderWidth / 2 : 0;
        };

        $scope.calcTop = function (shape) {
          return shape ? shape.top - shape.borderWidth / 2 : 0;
        };

        $scope.calcMidPointX = function (shape) {
          return shape ? shape.midPointX : 0;
        };

        $scope.calcMidPointY = function (shape) {
          return shape ? shape.midPointY : 0;
        };

        $scope.$watch('shape', function (shape) {
          if (!shape) {
            return;
          }

          var selectionBox = pathService.getSelectionBox(shape);
          $scope.width = selectionBox.width;
          $scope.height = selectionBox.height;
        });
      }

      function createSelectionBox(ngSvg) {
        var selectionBox = drawSelectionBox(ngSvg),
          selectionCorners = drawSelectionCorners(ngSvg, selectionBox);

        return {
          box:selectionBox,
          corners:selectionCorners
        };
      }

      function drawSelectionBox(ngSvg) {
        var transform = [
          'translate({{calcLeft(shape)}},{{calcTop(shape)}})',
          'rotate({{shape.rotation}},{{calcMidPointX(shape)}},{{calcMidPointY(shape)}})'
        ];

        var selectionBox = ngSvg.svg.group(ngSvg.selectionGroup, {
          transform:transform.join(', '),
          'ng-show':'shape'
        });

        ngSvg.svg.path(selectionBox, '', {
          'ng-attr-d':'M0,0L{{width}},0L{{width}},{{height}}L0,{{height}}z',
          fill:'none',
          fillOpacity:'0.3',
          'stroke-dasharray':'5,5',
          stroke:'#D90000',
          strokeWidth:2
        });
        return selectionBox;
      }

      function drawSelectionCorners(ngSvg, selectionBox) {
        var defaultCircleSettings = {
          class_:'resizable',
          fill:'#D90000',
          'stroke-width':1,
          stroke:'white'
        };

        var cornerNW = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id:'cornerNW',
          transform:'translate(0,0)'
        }));

        var cornerNE = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id:'cornerNE',
          transform:'translate({{width}},0)'
        }));

        var cornerSE = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id:'cornerSE',
          transform:'translate({{width}},{{height}})'
        }));

        var cornerSW = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id:'cornerSW',
          transform:'translate(0,{{height}})'
        }));

        ngSvg.svg.line(selectionBox, 0, 0, 0, (-1 * rotatorLineLength), {
          id:'rotatorLine',
          stroke:'#D90000',
          strokeWidth:3,
          transform:'translate({{shape.midPointX}},0)'
        });

        var rotator = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id:'rotator',
          fill:'#FFFFFF',
          stroke:'#D90000',
          strokeWidth:1,
          transform:'translate({{shape.midPointX}},-20)'
        }));

        return angular.element([cornerNW, cornerNE, cornerSE, cornerSW, rotator]);
      }

      function attachResizeBindings(selectionCorners, $scope, svg) {
        selectionCorners.draggable({
          start:function () {
//            self.resizeStarted();
          },
          drag:function (event, ui) {

            var draggedCorner = $(this),
              rawElement = $scope.shape.svgElement[0],
              newDim = getNewShapeLocationAndDimensions(draggedCorner, event, $scope),
              translation = getTranslation(rawElement, newDim.deltaX, newDim.deltaY, true),
              scaleX = newDim.width / $scope.width,
              scaleY = newDim.height / $scope.height,
              shapePath = $scope.shape.svgElement.find('.shape')[0],
              newShapePath = rescaleElement(shapePath, scaleX, scaleY);

            $scope.$apply(function () {
              $scope.top = translation.y;
              $scope.left = translation.x;
              $scope.width = newDim.width;
              $scope.height = newDim.height;

              $scope.shape.width = newDim.width;
              $scope.shape.height = newDim.height;

              $scope.shape.midPointX = newDim.width / 2;
              $scope.shape.midPointY = newDim.height / 2;

              $scope.shape.rotation = newDim.angle;
              $scope.shape.path = newShapePath;
            });
          },
          stop:function () {
          }
        });

        function getNewShapeLocationAndDimensions(draggedCorner, event, $scope) {
          var selectionBoxGroup = draggedCorner.parent()[0],
            pt = convertScreenToElementCoordinates(selectionBoxGroup, event),
            cornerId = draggedCorner.attr('id'),
            deltaX = 0,
            deltaY = 0,
            width = $scope.width,
            height = $scope.height,
            angle = $scope.shape.rotation;

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
          } else if (cornerId == 'rotator') {
            // ref point is height/2, -20
            var cx = height / 2;
            var cy = height / 2;

            var newAngle = getAngle({x:pt.x, y:pt.y},
              {x:cx, y:-20},
              {x:cx, y:cy});

            angle = (angle + newAngle) % 360;

            if (!event.shiftKey) {
              angle = Math.floor(angle / 15) * 15;
            }
          }

          var conversion = convertDeltasToSVG(selectionBoxGroup, deltaX, deltaY);

          return {
            deltaX:conversion.deltaX,
            deltaY:conversion.deltaY,
            width:width,
            height:height,
            angle:angle
          }
        }


        function convertScreenToElementCoordinates(selectionBoxGroup, event) {
          var matrix = selectionBoxGroup.getScreenCTM().inverse();

          // convert screen to element coordinates
          var pt = svg._svg.createSVGPoint();
          pt.x = event.pageX;
          pt.y = event.pageY;
          pt = pt.matrixTransform(matrix);

          return pt;
        }

        function convertDeltasToSVG(selectionBoxGroup, deltaX, deltaY) {
          var ptA = svg._svg.createSVGPoint();
          ptA.x = 0;
          ptA.y = 0;

          var ptB = ptA.matrixTransform(selectionBoxGroup.getCTM());

          var pt2 = svg._svg.createSVGPoint();
          pt2.x = deltaX;
          pt2.y = deltaY;
          pt2 = pt2.matrixTransform(selectionBoxGroup.getCTM());
          
          deltaX = ptB.x - pt2.x;
          deltaY = ptB.y - pt2.y;

          return {
            deltaX:deltaX,
            deltaY:deltaY
          };
        }

        function getRotation(pt, elt) {
          if (elt.transform.baseVal.numberOfItems > 1) {
            // make sure transform 1 is a translate transform
            var trans = elt.transform.baseVal.getItem(1);
            if (trans.type == 4) {
              var pt2 = pt.matrixTransform(trans.matrix);

              return {
                angle:trans.angle,
                offsetx:pt2.x,
                offsety:pt2.y
              };
            }
          }
          return {angle:0, offsetx:0, offsety:0};
        }

        function rescaleElement(element, scaleX, scaleY) {
          return transformShape(element, scaleX, scaleY, 0, 0);
        }

        function translateElement(element, transX, transY) {
          return transformShape(element, 1.0, 1.0, 0, 0);
        }

        function transformShape(element, scaleX, scaleY, transX, transY) {
          if (typeof(element.instanceRoot) != "undefined") {
            element = element.instanceRoot.correspondingElement;
          }

          // can't resize text
          if (!element.pathSegList) {
            return;
          }

          var newPath = svg.createPath();

          // create the new path element
          for (var i = 0; i < element.pathSegList.numberOfItems; i++) {
            var seg = element.pathSegList.getItem(i);

            // Create the new segment, applying the transform matrix
            switch (seg.pathSegType) {
              case 2:
                newPath = newPath.move(seg.x * scaleX + transX, seg.y * scaleY + transY);
                break;
              case 3:
                newPath = newPath.move(seg.x * scaleX, seg.y * scaleY, true);
                break;
              case 4:
                newPath = newPath.line(seg.x * scaleX + transX, seg.y * scaleY + transY);
                break;
              case 5:
                newPath = newPath.line(seg.x * scaleX, seg.y * scaleY, true);
                break;
              case 6:
                newPath = newPath.curveC(seg.x1 * scaleX + transX, seg.y1 * scaleY + transY, seg.x2 * scaleX + transX, seg.y2 * scaleY + transY, seg.x * scaleX + transX, seg.y * scaleY + transY);
                break;
              case 7:
                newPath = newPath.curveC(seg.x1 * scaleX, seg.y1 * scaleY, seg.x2 * scaleX, seg.y2 * scaleY, seg.x * scaleX, seg.y * scaleY, true);
                break;
              case 8:
                newPath = newPath.curveQ(seg.x1 * scaleX + tranX, seg.y1 * scaleY + transY, seg.x * scaleX + transX, seg.y * scaleY) + transY;
                break;
              case 9:
                newPath = newPath.curveQ(seg.x1 * scaleX, seg.y1 * scaleY, seg.x * scaleX, seg.y * scaleY, true);
                break;
              case 10:
                newPath = newPath.arc(scaleX * seg.r1 + transX, scaleY * seg.r2 + transY, seg.angle, seg.largeArcFlag, seg.sweepFlag, scaleX * seg.x + transX, scaleY * seg.y + transY);
              case 11:
                newPath = newPath.arc(scaleX * seg.r1, scaleY * seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag, scaleX * seg.x, scaleY * seg.y, true);
            }
          }

          return newPath.close().path();
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

        function dist(pt1, pt2) {
          return Math.sqrt(Math.pow(pt1.x - pt2.x, 2.0) + Math.pow(pt1.y - pt2.y, 2.0));
        }

        function getAngleABC(a, b, c) {
          var t = (a * a + b * b - c * c) / (2 * a * b);
          //  //console.log('t', t);
          return Math.acos(t);
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
            x:x,
            y:y
          };
        }
      }
    });
})();