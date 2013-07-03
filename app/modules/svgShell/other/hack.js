(function () {
  angular.module('svgShell')
    .controller('svgShellCtrl', function ($scope) {

      //hack

      $('#canvas').svg({onLoad: drawIntro});


      function drawIntro(svg) {
        ////console.log('svg');
        ////console.dir(svg);

        var defs = svg.defs('myDefs');

        var marker = svg.marker(defs, 'grabber', 0, 0, 5, 5, {
          viewBox: '-5 -5 10 10',
          markerUnits: 'strokeWidth'
        });

        svg.circle(marker, 0, 0, 4, {fill: 'red'});

        var clp1 = svg.clipPath(defs, 'clip1');
        var clp2 = svg.clipPath(defs, 'clip2');

        var path1 = svg.createPath();

        path1.move(0, 0)
          .line(100, 0)
          .line(100, 50)
          .line(50, 100)
          .line(0, 50)
          .close();

        var shape1 = svg.path(clp1, path1, {id: 'shape1'});

        var path2 = svg.createPath();
        path2.move(0, 75)
          .arc(/*rx*/75,/*ry*/ 75,/*xrotate*/ 0,/*large*/ 1,/*clockwise*/ 0,/*x*/ 150,/*y*/ 0,/*relative*/ true)
          .arc(75, 75, 0, 1, 0, -150, 0, true)
          .close();

        var shape2 = svg.path(clp2, path2, {id: 'shape2'});

        var g2 = svg.group({
          id: 'area1',
          class_: 'selectable',
          transform: 'translate(150, 150) rotate(60, 50, 50)'
        });

        var u1 = svg.use(g2, "#shape1", {
          id: 'fill1',
          fill: 'lightgreen'
        });

        var g3 = svg.group(g2, {
          clipPath: 'url(#clip1)'
        });

        var img1 = svg.image(g3, -100, -30, 160, 120,
          'http://3.bp.blogspot.com/-b1QUfXi1vEg/Ua6n_8JSdoI/AAAAAAAAFXU/Zz8_fBU3eOs/s1600/IMG_5464.JPG',
          {transform: 'rotate(-60, 0, 0)'});

        var u2 = svg.use(g2, "#shape1", {
          id: 'border1',
          fill: 'none',
          stroke: 'gray',
          strokeWidth: 3
        });

        var g3 = svg.group({
          id: 'area2',
          class_: 'selectable',
          transform: 'translate(300, 150) rotate(0, 50, 50)'
        });

        var u3 = svg.use(g3, "#shape2", {
          id: 'fill1',
          fill: 'lightgreen'
        });

        var g4 = svg.group(g3, {
          clipPath: 'url(#clip2)'
        });

        var img2 = svg.image(g4, -40, -10, 240, 180,
          'http://4.bp.blogspot.com/-PgIufqAaQgU/UVuN_yd7nZI/AAAAAAAAFUg/YSYVbzqdBpk/s1600/IMG_5368.JPG',
          {transform: 'rotate(0, 0, 0)'});

        var u4 = svg.use(g3, "#shape2", {
          id: 'border3',
          fill: 'none',
          stroke: 'gray',
          strokeWidth: 3
        });

        init(svg);
      }

      /** base functions **/
      function init(svg) {

        $('.selectable').click(function () {
          var bbox = this.lastElementChild.getBBox();
          translateRectToPath(svg, bbox, this.getAttribute('transform'), this.getAttribute('id'));
        });

        var dragObj = {
          start: function () {
            var matrix = this.parentNode.getScreenCTM().inverse();

            var pt = this.ownerSVGElement.createSVGPoint();
            pt.x = event.pageX;
            pt.y = event.pageY;
            pt = pt.matrixTransform(matrix);

            this.setAttribute('orig', JSON.stringify({x: pt.x, y: pt.y}));
          },
          drag: function (event, ui) {
            var matrix = this.parentNode.getScreenCTM().inverse();
            var orig = JSON.parse(this.getAttribute('orig'));
            // convert screen to element coordinates
            var pt = this.ownerSVGElement.createSVGPoint();
            pt.x = event.pageX;
            pt.y = event.pageY;
            pt = pt.matrixTransform(matrix);

            var deltax = pt.x - orig.x;
            var deltay = pt.y - orig.y;

            var pt2 = this.ownerSVGElement.createSVGPoint();
            pt2.x = deltax;
            pt2.y = deltay;
            pt2 = pt2.matrixTransform(this.parentNode.getCTM());

            var pt3 = this.ownerSVGElement.createSVGPoint();
            pt3.x = 0;
            pt3.y = 0;
            pt3 = pt3.matrixTransform(this.parentNode.getCTM());

            deltax = pt2.x - pt3.x;
            deltay = pt2.y - pt3.y;

            // //console.log('drag this', pt3, {x: pt2.x, y: pt2.y});
            // set the translate
            // svg.change(this, {cx: pt.x, cy: pt.y});

            adjustTranslate(this.parentNode, deltax, deltay, true);
            var linkedNodeId = this.parentNode.getAttribute('refId');
            var linkedNode = svg.getElementById(linkedNodeId);
            adjustTranslate(linkedNode, deltax, deltay, true);
          },
          stop: function () {

          }
        };

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
            scaleX = width / rect.width;
            scaleY = height / rect.height;

            setRotation(this.parentNode, angle, width / 2, height / 2);
            var linkedNodeId = this.parentNode.getAttribute('refId');
            var linkedNode = svg.getElementById(linkedNodeId);

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
              rescaleElement(svg, outlinePath, scaleX, scaleY);

              rect.width = width;
              rect.height = height;

              setCornerTransforms(svg, width, height);
              this.parentNode.setAttribute('rect1', JSON.stringify(rect));
              adjustTranslate(linkedNode, deltax, deltay, true);

              rescaleElement(svg, linkedNode.lastElementChild, scaleX, scaleY);
            }

            setRotation(linkedNode, angle, width / 2, height / 2);
            // Redraw the path

          },
          stop: function () {

          }
        }

        $('.draggable').draggable(dragObj);


        function translateRectToPath(svg, rect, transformStr, id) {
          var path = svg.createPath();

          path.move(0, 0)
            .line(rect.width, 0)
            .line(rect.width, rect.height)
            .line(0, rect.height)
            .close();

          var pathElt = $('#outlineShape');

          pathElt.each(function (index, p) {
            svg.remove(p);
          });

          var selectG = svg.group({
            id: 'outlineShape',
            refId: id,
            origRect: JSON.stringify(rect),
            rect1: JSON.stringify(rect),
            transform: transformStr
          });

          var pathx = svg.path(selectG, path, {
            id: 'outlinePath',
            fill: 'white',
            fillOpacity: '0.3',
            'stroke-dasharray': '5,5',
            stroke: '#D90000',
            strokeWidth: 2,
            class_: 'draggable'
          });

          var w2 = rect.width / 2;

          svg.circle(selectG, 0, 0, 5, {
            id: 'cornerNW',
            class_: 'resizable',
            fill: '#D90000',
            transform: 'translate(0,0)'
          });

          svg.circle(selectG, 0, 0, 5, {
            id: 'cornerNE',
            class_: 'resizable',
            fill: '#D90000',
            transform: 'translate(' + rect.width + ',0)'
          });

          svg.circle(selectG, 0, 0, 5, {
            id: 'cornerSE',
            class_: 'resizable',
            fill: '#D90000',
            transform: 'translate(' + rect.width + ',' + rect.height + ')'
          });

          svg.circle(selectG, 0, 0, 5, {
            id: 'cornerSW',
            class_: 'resizable',
            fill: '#D90000',
            transform: 'translate(0,' + rect.height + ')'
          });

          svg.line(selectG, 0, 0, 0, -20, {
            id: 'rotatorLine',
            stroke: '#D90000',
            strokeWidth: 3,
            transform: 'translate(' + w2 + ',0)'
          });

          svg.circle(selectG, 0, 0, 5, {
            id: 'rotator',
            class_: 'resizable',
            stroke: '#D90000',
            fill: '#FFFFFF',
            strokeWidth: 1,
            transform: 'translate(' + w2 + ',-20)'
          });

          $('.resizable').draggable(resizeObj);
          $('.draggable').draggable(dragObj);
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

//      function translatePt(svg, matrix, x, y) {
//        var pt1 = svg.root().createSVGPoint();
//        pt1.x = x;
//        pt1.y = y;
//
//        return pt1.matrixTransform(matrix);
//      }

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

    })
  ;

})();