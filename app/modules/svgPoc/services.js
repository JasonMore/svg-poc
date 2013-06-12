'use strict';
angular.module('svgPoc')

  .service('surfaceService', function() {
    this.element;
    this.transform;
  })

  .service('svgService', function(){
    this.compile = function(elem, attrs, transclude) {

      var xmlns = "http://www.w3.org/2000/svg";
      var replacement = document.createElementNS(xmlns,elem[0].localName);
      var a = elem[0].attributes;
      for (var i = 0; i < a.length ; i++) {
        replacement.setAttribute(a[i].name, a[i].value);
      }
      elem.replaceWith(replacement);
      return function postLink(scope, elem,attrs,controller){
//        console.log('link called');
      };
    }
  })
;