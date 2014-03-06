xdescribe('drawingSurfaceSpec.js', function() {
  var element,
    scope,
    controller,
    drawingSurface;
//
  beforeEach(module('preloadAllHtmlTemplates'));
  beforeEach(module('liveResource'));
  beforeEach(module('svg-poc'));

  beforeEach(inject(function ($rootScope, $compile, shapeViewModelService, $controller) {
    vmService = shapeViewModelService;
    element = angular.element('<ng-include src="\'modules/svgAbstraction/svgCanvas.html\'"></ng-include>');
    scope = $rootScope;
    $compile(element)(scope);
    scope.$digest();
    drawingSurface = element.find('g.drawing g');
  }));

  describe('when not drawing', function() {
    beforeEach(function() {
      scope.isDrawing = function() { return false; };
      scope.$digest();
    });

    it('drawing surface is not "visible" to be clicked on', function() {
      expect(drawingSurface.attr('style')).toBe('display: none;');
    });
  });

  describe('when drawing', function() {
    var shape,
      passedShapeFromDoneFunction;

    beforeEach(function() {
      scope.isDrawing = function() { return true;};
      scope.shapeDrawn = function(shape){
        passedShapeFromDoneFunction = shape;
      };

      scope.shapeType = function(){
        return 'square';
      };

      scope.$digest();

      var mouseDown = $.Event('mousedown', {
        which:1,
        clientX:50,
        clientY:50
      });

      var mousemove = $.Event("mousemove", {
        clientX:100,
        clientY:100
      });

      var mouseup = $.Event("mouseup", {
        clientX:100,
        clientY:100
      });

      var parentGroup = element.find('g');
      drawingSurface.trigger(mouseDown);
      drawingSurface.trigger(mousemove);
      drawingSurface.trigger(mouseup);
    });

    it('adds shape', function(){
      expect(passedShapeFromDoneFunction).toBeDefined()
    });

    it('sets shape top to 50', function() {
      expect(passedShapeFromDoneFunction.top).toEqual(50);
    });

    it('sets shape left to 50', function() {
      expect(passedShapeFromDoneFunction.left).toEqual(50);
    });

    it('sets width to 50', function() {
      expect(passedShapeFromDoneFunction.width).toEqual(50);
    });

    it('sets height to 50', function() {
      expect(passedShapeFromDoneFunction.height).toEqual(50);
    });

    it('sets path to square', function() {
      expect(passedShapeFromDoneFunction.path).toEqual('M0,0L50,0L50,50L0,50z');
    });
  });
});