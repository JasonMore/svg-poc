(function () {
  angular.module('svgShell.services').service('resizeService', function (surfaceService, textFlowService) {

    this.attachResizeBindings = function(controlPoints) {
      $(controlPoints).draggable(resizeObj);
    }

    var resizeObj = {
      start: function () {
        var matrix = this.parentNode.getScreenCTM().inverse();

        var pt = this.ownerSVGElement.createSVGPoint();
        pt.x = event.pageX;
        pt.y = event.pageY;
        pt = pt.matrixTransform(matrix);

        this.setAttribute('origX', JSON.stringify({x: 0, y: 0}));
        //    this.setAttribute('origY', event.pageT);
      },
      drag: function (event, ui) {
        var matrix = this.parentNode.getScreenCTM().inverse();

        // convert screen to element coordinates
        var pt = this.ownerSVGElement.createSVGPoint();
        pt.x = event.pageX;
        pt.y = event.pageY;
        pt = pt.matrixTransform(matrix);

        var ptA = this.ownerSVGElement.createSVGPoint();
        ptA.x = 0;
        ptA.y = 0;
        ptB = ptA.matrixTransform(this.parentNode.getCTM());

        var origRect = JSON.parse(this.parentNode.getAttribute('origRect'));

        var rect = this.parentNode.getAttribute('rect1');

        rect = JSON.parse(rect);

        var pt3 = this.ownerSVGElement.createSVGPoint();
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
        var linkedNode = $(this).data('groupToModify');

        if (!didRotate) {
          var pt2 = this.ownerSVGElement.createSVGPoint();
          pt2.x = deltax;
          pt2.y = deltay;
          pt2 = pt2.matrixTransform(this.parentNode.getCTM());


          pt3 = pt3.matrixTransform(this.parentNode.getCTM());

          // where should x,y be?

          deltax = ptB.x - pt2.x;
          deltay = ptB.y - pt2.y;


          adjustTranslate(this.parentNode, deltax, deltay, true);
          rescaleElement(surfaceService.svg, outlinePath, scaleX, scaleY);

          rect.width = width;
          rect.height = height;

          setCornerTransforms(surfaceService.svg, width, height);
          this.parentNode.setAttribute('rect1', JSON.stringify(rect));
          adjustTranslate(linkedNode, deltax, deltay, true);

          var shape = $(linkedNode).find('.shape')[0];
          rescaleElement(surfaceService.svg, shape, scaleX, scaleY);
        }

        setRotation(linkedNode, angle, width / 2, height / 2);
        // Redraw the path

      },
      stop: function () {

      }
    }

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

    function adjustTranslate(elt, x, y, rel) {

      if (elt.transform.baseVal.numberOfItems > 0) {
        // make sure transform 1 is a translate transform
        var trans = elt.transform.baseVal.getItem(0);
        if (trans.type == 2) {
          if (rel) {

            var origX = trans.matrix.e;
            var origY = trans.matrix.f;

            //  //console.log('AdjustTranslate', x, y);
            trans.setTranslate(origX + x, origY + y);
          } else {
            trans.setTranslate(x, y);
          }
        }
      }
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

    function rescaleElement(svg, element, scaleX, scaleY) {
      if (typeof(element.instanceRoot) != "undefined") {
        element = element.instanceRoot.correspondingElement;
      }

      // can't resize text
      if(!element.pathSegList){
        return;
      }

      var newPath = svg.createPath();

      // create the new path element
      for (var i = 0; i < element.pathSegList.numberOfItems; i++) {
        var seg = element.pathSegList.getItem(i);

        // Create the new segment, applying the transform matrix
        switch (seg.pathSegType) {
          case 2:
            newPath = newPath.move(seg.x * scaleX, seg.y * scaleY);
            break;
          case 3:
            newPath = newPath.move(seg.x * scaleX, seg.y * scaleY, true);
            break;
          case 4:
            newPath = newPath.line(seg.x * scaleX, seg.y * scaleY);
            break;
          case 5:
            newPath = newPath.line(seg.x * scaleX, seg.y * scaleY, true);
            break;
          case 8:
            newPath = newPath.curveQ(seg.x1 * scaleX, seg.y1 * scaleY, seg.x * scaleX, seg.y * scaleY);
            break;
          case 9:
            newPath = newPath.curveQ(seg.x1 * scaleX, seg.y1 * scaleY, seg.x * scaleX, seg.y * scaleY, true);
            break;
          case 10:
            newPath = newPath.arc(scaleX * seg.r1, scaleY * seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag, scaleX * seg.x, scaleY * seg.y);
          case 11:
            newPath = newPath.arc(scaleX * seg.r1, scaleY * seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag, scaleX * seg.x, scaleY * seg.y, true);
        }
      }

      newPath = newPath.close();
      element.setAttribute('d', newPath.path());

      textFlowService.updateTextFlowForCurrentShape();
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