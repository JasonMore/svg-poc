(function () {
  angular.module('ngSvg.directives')
    .directive('path', function ($compile) {
      return {
        restrict: "E",
        replace: true,
        transclude: false,
        compile: function (element, attrs) {
          var newElement;

          angular.element('<div></div>').svg({onLoad: function (svg) {
            element.replaceWith(svg._makeNode('', 'path'));
          }});

          return function link(scope, element, attrs, controller) {
            var cleanAttr = _.omit(attrs, function (value, name) {
              // skip anything starting with $
              if (/^\$/.test(name)) {
                return true;
              }
              return false;
            });

            console.log(JSON.stringify(cleanAttr));
            // element.attr('ng-attr-d', attrs.d);
            element.attr(cleanAttr);
          };
        }
      };
    });
})();