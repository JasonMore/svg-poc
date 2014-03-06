describe('svgCanvas.js >', function() {
  var element, scope, controller;

  beforeEach(module('preloadAllHtmlTemplates'));
  beforeEach(module('svg-poc'));

  describe('creating >', function() {
    var shapes;

    beforeEach(inject(function($rootScope, $compile, $controller) {
      scope = $rootScope.$new();

      shapes = {};
      scope.template = {width: 100, height: 100};
      scope.zoom = 1;
      scope.computedShapes = function() {
        return shapes;
      };
      scope.selectedShape = null;
      scope.shapeToDraw = null;

      element = angular.element('<svg-canvas ' +
        'template="template"' +
        'computed-shapes="computedShapes"' +
        'selected-shape="selectedShape"' +
        'shape-to-draw="shapeToDraw"' +
        'zoom="zoom"' +
        '></svg-canvas>');

      controller = $controller('svgCanvasCtrl', {$scope: scope, $element: element});
      $compile(element)(scope);
      scope.$digest();
    }));

    it('template creates svg element', function() {
      expect(element[0].nodeName).toBe('svg');
    });

    it('svg has width', function() {
      expect(element.attr('width')).toEqual('100');
    });

    it('svg has height', function() {
      expect(element.attr('height')).toEqual('100');
    });

    describe('changing zoom >', function() {
      beforeEach(function() {
        scope.zoom = 2;
        scope.$digest();
      });

      it('doubles width', function() {
        expect(element.attr('width')).toEqual('200');
      });

      it('doubles height', function() {
        expect(element.attr('width')).toEqual('200');
      });

      it('doesnt change viewbox', function() {
        expect(element[0].attributes['viewBox'].value).toEqual('0 0 100 100');
      });
    });
  });
});