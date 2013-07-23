(function () {
  angular.module('svgShell.services').service('resizeService', function (surfaceService, translationService) {
    var self = this;

    // external methods
    self.resizeStarted;
    self.resizeEnded;

    this.attachResizeBindings = function(controlPoints) {
      $(controlPoints).draggable(resizeObj);
    }

      this.rescaleElement = rescaleElement;
      this.transformShape = transformShape;

      var resizeObj = {
        start: function () {
          self.resizeStarted();
          var matrix = this.parentNode.getScreenCTM().inverse();

          var pt = surfaceService.svg._svg.createSVGPoint();
          pt.x = event.pageX;
          pt.y = event.pageY;
          pt = pt.matrixTransform(matrix);

          this.setAttribute('origX', JSON.stringify({x: 0, y: 0}));
          //    this.setAttribute('origY', event.pageT);
        },
        drag: function (event, ui) {
          var matrix = this.parentNode.getScreenCTM().inverse();

          // convert screen to element coordinates
          var pt = surfaceService.svg._svg.createSVGPoint();
          pt.x = event.pageX;
          pt.y = event.pageY;
          pt = pt.matrixTransform(matrix);

          var ptA = surfaceService.svg._svg.createSVGPoint();
          ptA.x = 0;
          ptA.y = 0;
          ptB = ptA.matrixTransform(this.parentNode.getCTM());

          var origRect = JSON.parse(this.parentNode.getAttribute('origRect'));

          var rect = this.parentNode.getAttribute('rect1');

          rect = JSON.parse(rect);

          var pt3 = surfaceService.svg._svg.createSVGPoint();
          pt3.x = 0;
          pt3.y = 0;

          var deltax = 0,
            deltay = 0,
            width = rect.width,
            height = rect.height;

          var scaleX = 1;
          var scaleY = 1;
          var rotateInfo = getRotation(pt3, this.parentNode);
          var didRotate = false;

          var angle = rotateInfo.angle;

          var outlinePath = surfaceService.svg.getElementById('outlinePath');

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
          scaleX = width / rect.width;
          scaleY = height / rect.height;

          setRotation(this.parentNode, angle, width / 2, height / 2);
          var groupToModify = $(this).data('groupToModify');

          if (!didRotate) {
            var pt2 = surfaceService.svg._svg.createSVGPoint();
            pt2.x = deltax;
            pt2.y = deltay;
            pt2 = pt2.matrixTransform(this.parentNode.getCTM());


            pt3 = pt3.matrixTransform(this.parentNode.getCTM());

            // where should x,y be?

            deltax = ptB.x - pt2.x;
            deltay = ptB.y - pt2.y;


            translationService.adjustTranslate(this.parentNode, deltax, deltay, true);
            rescaleElement(outlinePath, scaleX, scaleY);

            rect.width = width;
            rect.height = height;

            setCornerTransforms(surfaceService.svg, width, height);
            this.parentNode.setAttribute('rect1', JSON.stringify(rect));
            translationService.adjustTranslate(groupToModify, deltax, deltay, true);

            var shape = $(groupToModify).find('.shape')[0];
            rescaleElement(shape, scaleX, scaleY);


            // TODO: I need the new top and left coordinates of the redrawn box
            //$(groupToModify).data('translationOffset', {top: rect.top, left: rect.left});
          }

          setRotation(groupToModify, angle, width / 2, height / 2);
          // Redraw the path

        },
        stop: function () {
          self.resizeEnded();
        }
      };

    function setCornerTransforms(svg, width, height) {
      var cornerNW = svg.getElementById('cornerNW');
      var cornerNE = svg.getElementById('cornerNE');
      var cornerSE = svg.getElementById('cornerSE');
      var cornerSW = svg.getElementById('cornerSW');
      var rotator = svg.getElementById('rotator');
      var rotatorLine = svg.getElementById('rotatorLine');

      var halfwidth = width / 2;
      cornerNW.setAttribute('transform', 'translate(0,0)');
      cornerNE.setAttribute('transform', 'translate(' + width + ',0)');
      cornerSE.setAttribute('transform', 'translate(' + width + ',' + height + ')');
      cornerSW.setAttribute('transform', 'translate(0,' + height + ')');
      rotator.setAttribute('transform', 'translate(' + halfwidth + ',-20 )');
      rotatorLine.setAttribute('transform', 'translate(' + halfwidth + ',0 )');
    }

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

    function setRotation(elt, angle, x, y) {
      if (elt.transform.baseVal.numberOfItems > 1) {
        // make sure transform 1 is a translate transform
        var trans = elt.transform.baseVal.getItem(1);
        if (trans.type == 4) {
          trans.setRotate(angle, x, y);
        }
      }
    }

    function rescaleElement(element, scaleX, scaleY) {
        transformShape(element, scaleX, scaleY, 0, 0);
    }

    function translateElement(element, transX, transY) {
          transformShape(element, 1.0, 1.0, 0, 0);
    }

    function transformShape(element, scaleX, scaleY, transX, transY) {
      if (typeof(element.instanceRoot) != "undefined") {
        element = element.instanceRoot.correspondingElement;
      }

      // can't resize text
      if(!element.pathSegList){
        return;
      }

      var newPath = surfaceService.svg.createPath();

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

      newPath = newPath.close();
      element.setAttribute('d', newPath.path());

    }

    function getAngle(ptA, ptB, ptC) {
      var a = dist(ptB, ptC);
      var b = dist(ptA, ptC);
      var c = dist(ptA, ptB);

      //   //console.log('abc', {a: a, b: b, c: c});
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


  });
})();