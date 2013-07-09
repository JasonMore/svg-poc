(function () {

  // remember: services in angular are singletons!
  angular.module('svgShell.services').service('surfaceService', function () {
    var self = this;

    // div containing svg
    self.svgsketch;

    // svg element
    self.svg;

    // rect that 100% fills the svg
    self.surface;

    self.resetSize = function (width, height) {
      self.svg.configure({
        width: width || $(self.svg._container).width(),
        height: height || $(self.svg._container).height()
      });
    };

  });
})();