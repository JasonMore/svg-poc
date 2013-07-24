(function () {
  var rotatorLineLength = 20;

  angular.module('svgAbstraction.directives')
    .directive('selectionBox', function ($compile, pathService) {
      return {
        restrict: 'E',
        require: '^ngSvg',
        scope: {
          shape: '='
        },
        controller: function ($scope) {
          $scope.width = 0;
          $scope.height = 0;
        },
        link: function ($scope, element, attr, ngSvgController) {
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
          box: selectionBox,
          corners: selectionCorners
        };
      }

      function drawSelectionBox(ngSvg) {
        var transform = [
          'translate({{calcLeft(shape)}},{{calcTop(shape)}})',
          'rotate({{shape.rotation}},{{calcMidPointX(shape)}},{{calcMidPointY(shape)}})'
        ];

        var selectionBox = ngSvg.svg.group(ngSvg.selectionGroup, {
          transform: transform.join(', '),
          'ng-show': 'shape'
//          origRect: JSON.stringify(boundingBox),
//          rect1: JSON.stringify(boundingBox),
//          transform: transformStr
        });

        ngSvg.svg.path(selectionBox, '', {
//          id: 'outlinePath',
          'ng-attr-d': 'M0,0L{{width}},0L{{width}},{{height}}L0,{{height}}z',
          fill: 'none',
//          fill: 'white',
          fillOpacity: '0.3',
          'stroke-dasharray': '5,5',
          stroke: '#D90000',
          strokeWidth: 2
//          class: 'draggable'
        });
        return selectionBox;
      }

      function drawSelectionCorners(ngSvg, selectionBox) {
        var defaultCircleSettings = {
          class_: 'resizable',
          fill: '#D90000',
          'stroke-width': 1,
          stroke: 'white'
        };

        var cornerNW = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id: 'cornerNW',
          transform: 'translate(0,0)'
        }));

        var cornerNE = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id: 'cornerNE',
          transform: 'translate({{width}},0)'
        }));

        var cornerSE = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id: 'cornerSE',
          transform: 'translate({{width}},{{height}})'
        }));

        var cornerSW = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id: 'cornerSW',
          transform: 'translate(0,{{height}})'
        }));

        ngSvg.svg.line(selectionBox, 0, 0, 0, (-1 * rotatorLineLength), {
          id: 'rotatorLine',
          stroke: '#D90000',
          strokeWidth: 3,
          transform: 'translate({{shape.midPointX}},0)'
        });

        var rotator = ngSvg.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
          id: 'rotator',
          fill: '#FFFFFF',
          stroke: '#D90000',
          strokeWidth: 1,
          transform: 'translate({{shape.midPointX}},-20)'
        }));

        return angular.element([cornerNW, cornerNE, cornerSE, cornerSW, rotator]);
      }

      function attachResizeBindings(selectionCorners, $scope, svg) {
        var origX;

        selectionCorners.draggable({
          start: function () {
//            self.resizeStarted();
          },
          drag: function (event, ui) {
            var matrix = this.parentNode.getScreenCTM().inverse();

            // convert screen to element coordinates
            var pt = svg._svg.createSVGPoint();
            pt.x = event.pageX;
            pt.y = event.pageY;
            pt = pt.matrixTransform(matrix);

            var ptA = svg._svg.createSVGPoint();
            ptA.x = 0;
            ptA.y = 0;
            ptB = ptA.matrixTransform(this.parentNode.getCTM());

            var pt3 = svg._svg.createSVGPoint();
            pt3.x = 0;
            pt3.y = 0;

            var deltax = 0,
              deltay = 0,
              width = $scope.width,
              height = $scope.height;

            var scaleX = 1;
            var scaleY = 1;
//            var rotateInfo = getRotation(pt3, this.parentNode);
            var didRotate = false;

            var angle = $scope.shape.rotation;

            var outlinePath = svg.getElementById('outlinePath');

            if (this.getAttribute('id') == 'cornerNW') {
              deltax = -pt.x;
              deltay = -pt.y;
              width = width - pt.x;
              height = height - pt.y;
            } else if (this.getAttribute('id') == 'cornerNE') {
              deltay = -pt.y;
              width = pt.x;
              height = height - pt.y;
            } else if (this.getAttribute('id') == 'cornerSE') {
              width = pt.x;
              height = pt.y;
            } else if (this.getAttribute('id') == 'cornerSW') {
              deltax = -pt.x;
              width = width - pt.x;
              height = pt.y;
            } else if (this.getAttribute('id') == 'rotator') {
              // ref point is height/2, -20
              var cx = height / 2;
              var cy = height / 2;

              var newAngle = getAngle({x: pt.x, y: pt.y},
                {x: cx, y: -20},
                {x: cx, y: cy});

              angle = (angle + newAngle) % 360;

              if (!event.shiftKey) {
                angle = Math.floor(angle / 15) * 15;
              }

              didRotate = true;
            }
            scaleX = width / $scope.width;
            scaleY = height / $scope.height;

            var pt2 = svg._svg.createSVGPoint();
            pt2.x = deltax;
            pt2.y = deltay;
            pt2 = pt2.matrixTransform(this.parentNode.getCTM());

            // where should x,y be?

            deltax = ptB.x - pt2.x;
            deltay = ptB.y - pt2.y;

            adjustTranslate($scope.shape.svgElement[0], deltax, deltay, true);

            var shape = $scope.shape.svgElement.find('.shape')[0];
            var newShapePath = rescaleElement(shape, scaleX, scaleY);

            $scope.$apply(function () {
              $scope.width = width;
              $scope.height = height;

              $scope.shape.width = width;
              $scope.shape.height = height;

              $scope.shape.midPointX = width / 2;
              $scope.shape.midPointY = height / 2;

              $scope.shape.rotation = angle;
              $scope.shape.path = newShapePath;
            });
          },
          stop: function () {
          }
        });
//      }

        function getRotation(pt, elt) {
          if (elt.transform.baseVal.numberOfItems > 1) {
            // make sure transform 1 is a translate transform
            var trans = elt.transform.baseVal.getItem(1);
            if (trans.type == 4) {
              var pt2 = pt.matrixTransform(trans.matrix);

              return {
                angle: trans.angle,
                offsetx: pt2.x,
                offsety: pt2.y
              };
            }
          }
          return {angle: 0, offsetx: 0, offsety: 0};
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

//          $scope.$apply(function () {
//            $scope.shape.path = newPath.path();
//          });
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

        function adjustTranslate(elt, x, y, isRelative) {
          if (!elt.transform.baseVal.numberOfItems) {
            return;
          }

          // make sure transform 1 is a translate transform
          var trans = elt.transform.baseVal.getItem(0);
          if (trans.type !== 2) {
            return;
          }

          if (isRelative) {
            var origX = trans.matrix.e;
            var origY = trans.matrix.f;

            x += origX;
            y += origY;
          }

          $scope.$apply(function () {
            $scope.shape.left = x;
            $scope.shape.top = y;
          });
        }
      }
    });
})();