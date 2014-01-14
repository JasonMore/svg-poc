describe('svgCanvas.js >', function() {
  var element, scope, controller;

  beforeEach(module('preloadAllHtmlTemplates'));
  beforeEach(module('svgAbstraction'));

  describe('creating >', function() {
    beforeEach(inject(function($rootScope, $compile, $controller) {
      scope = $rootScope.$new();

      scope.canvas = {
        shapes: {},
        template: {width: 100, height: 100},
        zoom: 1
      };

      scope.canvas.computedShapes = function() {
        return scope.canvas.shapes;
      };

      element = angular.element('<svg-canvas canvas="canvas"></svg-canvas>');
      controller = $controller('svgCanvasCtrl', {$scope: scope, $element: element});
      $compile(element)(scope);
      scope.$digest();
    }));

    it('template creates svg element', function() {
      expect(element[0].nodeName).toBe('svg');
    });


  });
});