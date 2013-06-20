(function () {
  angular.module('svgShell.services').service('textFlowService', function (surfaceService) {

    this.checkWordFits = checkWordFits;
    this.recalcText = recalcText;


    //rectVisible checks the 4 corners of the rectangle to see if the
    //container shape is the top shape at the 4 corners. This heuristic
    //isn't perfect, since there could be shapes that do not cover
    //any of the 4 corners, but still block the letter. However, the rectangles
    //are fairly small, and checking all the points isn't efficient.
    function checkWordFits(svg, container, margin, currentWord) {
      var matrix = container.getScreenCTM();

//        var svg = $('#svgDiv').svg('get').root();
      svg = svg.root();

      var yVals = [currentWord.y - margin + 1, currentWord.y + currentWord.height + margin - 1];

      var matrix2 = container.getTransformToElement(svg);

      for (var i = currentWord.checkPoints.length - 1; i >= 0; i--) {
        for (var j = 0; j < yVals.length; j++) {
          var pt1 = svg.createSVGPoint();

          var tmpX;
          var tmpY;

          if (i == 0) {
            // If it is the first x, then move back the margin
            pt1.x = currentWord.x + currentWord.checkPoints[i] - margin + 1;
          } else if (i == currentWord.checkPoints.length - 1) {
            // If it is the last x, then move forward the margin
            pt1.x = currentWord.x + currentWord.checkPoints[i] + margin - 1;
          } else {
            // otherwise, just check the x
            pt1.x = currentWord.x + currentWord.checkPoints[i];
          }
          pt1.y = yVals[j];

          tmpX = pt1.x;
          tmpY = pt1.y;

          // the pt point is in coordinate space belonging to the containter
          // Fortunately, it is easy to convert to screen cordinates with
          // a matrix transformation
          var pt2 = pt1.matrixTransform(matrix);


          // Get the top element at the point in screen coordinates
          var hit = document.elementFromPoint(pt2.x, pt2.y);


          // If the hit is null, then the points are off the screen
          // If the hit doesn't match the container, the container
          // is not on top.
          if (hit == null || hit !== container) {
            //var pt3 = pt1.matrixTransform(matrix2);
            //$('#svgDiv').svg('get').circle(pt3.x, pt3.y, 1, {id: 'circle2', class: 'svgdrag', fillOpacity: 0.9, fill: 'white', stroke: 'red', strokeWidth: 2});
            return false;
          }
        }
      }


      return true;
    }

    // Recalculate the text positioning for a text node.
    function recalcText(svgText, container) {
      // get the jquery svg object
//        var svg = $('#svgDiv').svg('get');
      var svg = surfaceService.svg;

      // get the next sibling. We'll be removing the text node, and this keeps
      // track of where to put it back.
      var nextSibling = svgText.nextSibling;

      // The parent element of the text node.
      var svgG = svgText.parentElement;

      // The text element has a custom attribute called container.
      // This references the shape that the text should be clipping
      // against.


      // jmore - this is the rectangle
//      var container = document.getElementById(svgText.getAttribute('container'));

      // Get Bounding box of the container
      var bbox = container.getBBox();

      // Total number of characters in the text block
      var numberofChars = svgText.getNumberOfChars();
      var words = [];
      var currentWord = null;
      // Get the text of the text node.
      var textContent = svgText.textContent;
      var height = 0;

      // remove all the preset X & Y's. This clears out all the formatting.
      while (svgText.x.baseVal.numberOfItems > 0) {
        svgText.x.baseVal.removeItem(0);
      }
      while (svgText.y.baseVal.numberOfItems > 0) {
        svgText.y.baseVal.removeItem(0);
      }

      // Loop through each of the characters in the text node
      for (var i = 0; i < numberofChars; i++) {
        // Grab the rectangle for each char
        var r = svgText.getExtentOfChar(i);
        // Grab the value of that piece of text
        var c = textContent.substring(i, i + 1);

        if (currentWord == null) {
          currentWord = {x:r.x, checkPoints:[0], height:r.height, chars:[]};
        } else if (currentWord.height < r.height) {
          currentWord.height = r.height
        }
        // The line height is the same for all the rows. It is equal to the height of
        // the tallest character. If the assumption that all the characters are the
        // same height, this isn't imporant
        if (r.height > height) {
          height = r.height;
        }
        // Push the bounding rectable of the character onto the array
        //currentWord.charRect.push(r);
        currentWord.chars.push({c:c, x:r.x - currentWord.x});

        // If the character is a space, this indicates a new word is following
        if (c == " ") {
          currentWord.width = r.x + r.width - currentWord.x;
          words.push(currentWord);
          currentWord = null;
        } else {
          // Add the checkpoints
          currentWord.checkPoints.push(r.x + r.width - currentWord.x);
        }
        // Should be refactored out keep track of the last rectangle
        prev = r;
      }

      if (currentWord != null) {
        currentWord.width = currentWord.checkPoints[currentWord.checkPoints.length - 1];
        words.push(currentWord);
      }

      // Add one to the height to prevent
      height++;

      // Remove the text item. This way there won't be collisions with the
      // hit test against the text area. If the text is there, it might be on
      // top of the container and register. Might be a better way to do this,
      // like put text behind the container, but it works.
      svgG.removeChild(svgText);


      // Margin should be set as a custom attribute of the text block
      var xPos = yPos = margin = 3;
      var i = 0;

      // Go back through the text, this time placing it on the line
      // COuld this be done in 1 loop? probably, but would get a little
      // tricky with word wrapping.
      while (i < words.length) {
        // Get the rect o the currect char
        currentWord = words[i];

        currentWord.x = xPos;
        currentWord.y = yPos;
        // Does the word fit?
        while (!checkWordFits(svg, container, margin, currentWord)) {
          currentWord.x += 5
          ; // This may be too low, or create a
          // better heuristic check like a binary search such as
          // check the word length ahead.

          // If you extend past the bounding box of the container, move to the
          // next line and reset your x position to the margin.
          if (currentWord.x > (bbox.x + bbox.width)) {
            currentWord.x = margin;
            currentWord.y += height;
          }
          // If you are beyond the bounding box vertically, the text does not
          // fit in the shape. This is an exception case.
          if (currentWord.y > (bbox.y + bbox.height)) {
            // this is an error!
            console.log('ERROR');
            break;
          }
        }
        yPos = currentWord.y;
        // Draw the word

        for (var j = 0; j < currentWord.chars.length; j++) {
          var newX = svg.root().createSVGLength();
          var newY = svg.root().createSVGLength();

          newX.value = currentWord.x + currentWord.chars[j].x;
          newY.value = currentWord.y + currentWord.height;

          svgText.x.baseVal.appendItem(newX);
          svgText.y.baseVal.appendItem(newY);
        }
        xPos = currentWord.x + currentWord.width;
        i++;
      }

      // Add the text node back in its original position
      if (nextSibling == null) {
        svgG.appendChild(svgText);
      } else {
        svgG.insertBefore(svgText, nextSibling);
      }
    }

  });
})();