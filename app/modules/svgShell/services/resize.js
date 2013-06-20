(function () {
  angular.module('svgShell.services').service('resizeService', function () {
    var svgRoot = document.getElementById("svgRoot");

    var svgns = "http://www.w3.org/2000/svg";

    var lineAB = document.getElementById("lineAB");


    var svgDocument = lineAB.ownerDocument;
    var parentNode = lineAB.parentNode;
    var orig = lineAB;

    var matrix = lineAB.getTransformToElement(lineAB.parentNode);

    if (typeof(lineAB.instanceRoot) != "undefined") {
      lineAB = lineAB.instanceRoot.correspondingElement;

      matrix = matrix.multiply(lineAB.getTransformToElement(lineAB.parentNode));
      //  matrix =  lineAB.getTransformToElement(orig.parentNode);

    }
    console.log('matrix', matrix);
    var newPath = svgDocument.createElementNS("http://www.w3.org/2000/svg", "path");

// create the new path element

    for (var i = 0; i < lineAB.pathSegList.numberOfItems; i++) {
      var seg = lineAB.pathSegList.getItem(i);

//    console.log('pathSegType', seg.pathSegType);


      // Creat the new segment, applying the transform matrix
      switch (seg.pathSegType) {
        case 2:
          var pt1 = svgRoot.createSVGPoint();
          pt1.x = seg.x;
          pt1.y = seg.y;
          var pt2 = pt1.matrixTransform(matrix);
          newPath.pathSegList.appendItem(newPath.createSVGPathSegMovetoAbs(pt2.x, pt2.y));
          break;
        case 3:
          var pt1 = svgRoot.createSVGPoint();
          pt1.x = seg.x;
          pt1.y = seg.y;
          var pt2 = pt1.matrixTransform(matrix);
          newPath.pathSegList.appendItem(newPath.createSVGPathSegMovetoRel(pt2.x, pt2.y));
          break;
        case 4:
          var pt1 = svgRoot.createSVGPoint();
          pt1.x = seg.x;
          pt1.y = seg.y;
          var pt2 = pt1.matrixTransform(matrix);


          newPath.pathSegList.appendItem(newPath.createSVGPathSegLinetoAbs(pt2.x, pt2.y));
          break;
        case 5:
          var pt1 = svgRoot.createSVGPoint();
          pt1.x = seg.x;
          pt1.y = seg.y;
          var pt2 = pt1.matrixTransform(matrix);
          newPath.pathSegList.appendItem(newPath.createSVGPathSegLinetoRel(pt2.x, pt2.y));
          break;
        case 8:
          var pt1 = svgRoot.createSVGPoint();
          pt1.x = seg.x;
          pt1.y = seg.y;

          var pt2 = svgRoot.createSVGPoint();
          pt2.x = seg.x1;
          pt2.y = seg.y1;

          var pt1 = pt1.matrixTransform(matrix);
          var pt2 = pt2.matrixTransform(matrix);


          newPath.pathSegList.appendItem(newPath.createSVGPathSegCurvetoQuadraticAbs(pt1.x, pt1.y, pt2.x, pt2.y));
          break;
      }
    }

    newPath.setAttributeNS(null, "id", lineAB.getAttributeNS(null, 'id'));


    lineAB.parentNode.replaceChild(newPath, lineAB);
//parentNode.appendChild(newPath);

    var origClone = orig.cloneNode(true);
    /*
     origClone.setAttributeNS(null, "stroke", "red");
     origClone.setAttributeNS(null, "stroke-width", "10");
     origClone.setAttributeNS(null, "fill", "none");
     origClone.setAttributeNS(null, "opacity", "0.5");*/
    origClone.setAttributeNS(null, "transform", "");

    orig.parentNode.replaceChild(origClone, orig);
//lineAB.parentNode.removeChild(lineAB);
//  lineAB.parentNode.replaceChild(newPath, lineAB);


  });
})();