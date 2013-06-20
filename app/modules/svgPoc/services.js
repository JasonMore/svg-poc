(function () {
  'use strict';
  angular.module('svgPoc.services', [])

    .service('surfaceService', function () {
      this.element;
      this.transform;
    })

    .service('svgService', function ($timeout) {

      this.recalculateTransformation = function(el, box) {
        // hack :-(
        // need to calculate transformation after box moved
        $timeout(function () {
          var transform = el.getCTM();
          transform.scale = true;
          var transformMatrix = transform.a + " " + transform.b + " " + transform.c + " " + transform.d + " " + transform.e + " " + transform.f;

          box.boundingBox = {
            box: el.getBBox(),
            transform: transformMatrix
          };
        }, 0);
      };

      // converts all DOM elements in a template to SVG elements
      this.compileNode = function() {

        return function (elem, attrs, transclude) {
          compileNode(elem);

          return function postLink(scope, elem, attrs, controller) {
            //        console.log('link called');
          };
        }

        function compileNode(angularElement) {
          var rawElement = angularElement[0];

          //new lines have no localName
          if (!rawElement.localName) {
            var text = document.createTextNode(rawElement.wholeText);
            return angular.element(text);
          }

          // set namespace so correct SVG element type is created
          var xmlns = "http://www.w3.org/2000/svg";

          // create a new SVG node with the name
          var replacement = document.createElementNS(xmlns, rawElement.localName);

          var children = angularElement.children();

          angular.forEach(children, function (value) {
            // call each child node recursively to convert them to SVG
            var newChildNode = compileNode(angular.element(value));
            replacement.appendChild(newChildNode[0]);
          });

          // get all the attributes and assign them to the new SVG element
          var attributes = rawElement.attributes;
          for (var i = 0; i < attributes.length; i++) {
            replacement.setAttribute(attributes[i].name, attributes[i].value);
          }

          // set the text from the template
          if (rawElement.localName === 'text') {
            replacement.textContent = rawElement.innerText;
          }

          // replace the DOM element with the SVG element
          angularElement.replaceWith(replacement);

          // return the new element wrapped in an angular element
          return angular.element(replacement);
        };
      }
    })
  ;
}());

