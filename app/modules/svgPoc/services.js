'use strict';
angular.module('svgPoc')

  .service('surfaceService', function() {
    this.element;
    this.transform;
  })

  // this is broken for now
  .service('svgService', function(){

    var xmlns = "http://www.w3.org/2000/svg";
    var compileNode = function(angularElement){
      var rawElement = angularElement[0];

      if(!rawElement.localName){
        return document.createTextNode(rawElement.wholeText);
      }
      var replacement = document.createElementNS(xmlns,rawElement.localName);
      var children = angularElement.children();
      
      angular.forEach(children, function (value) {
        var newChildNode = compileNode(angular.element(value));
        replacement.appendChild(newChildNode[0]);
      });

      var attributes = rawElement.attributes;
      for (var i = 0; i < attributes.length ; i++) {
        replacement.setAttribute(attributes[i].name, attributes[i].value);
      }
      angularElement = angularElement.replaceWith(replacement);

      return angularElement;
    };

    this.compile = function(elem, attrs, transclude) {
      compileNode(elem);

      return function postLink(scope, elem,attrs,controller){
//        console.log('link called');
      };
    }
  })
;