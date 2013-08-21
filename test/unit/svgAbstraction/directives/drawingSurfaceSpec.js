describe('drawingSurfaceSpec.js', function() {
  var element,
    scope,
    controller,
    drawingSurface;

  beforeEach(module('svgAbstraction'));

  beforeEach(inject(function($rootScope, $compile, $controller){
    var html = '' +
      '<ng-svg>' +
      '<drawing-surface ' +
      ' active="isDrawing" ' +
      ' model="shapes" ' +
      ' shape="shapeType" ' +
      ' when-done="setSelectedShape(shape)">' +
      '</drawing-surface>' +
      '</ng-svg>';

    element = angular.element(html);
    scope = $rootScope;
//    controller = $controller('ngSvgController', {$element: element});

    scope.shapes = [];

    $compile(element)(scope);

    drawingSurface = element.find('g.drawing g');
  }));

  describe('when not drawing', function() {
    beforeEach(function() {
      scope.isDrawing = false;
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
      scope.isDrawing = true;
      scope.shapeType = 'square';
      scope.setSelectedShape = function(shape){
        passedShapeFromDoneFunction = shape;
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
      parentGroup.trigger(mouseDown);
      parentGroup.trigger(mousemove);
      parentGroup.trigger(mouseup);

      shape = scope.shapes[0];
    });

    it('adds shape', function(){
      expect(scope.shapes.length).toEqual(1);
    });

    it('sets shape top to 50', function() {
      expect(shape.model.top).toEqual(50);
    });

    it('sets shape left to 50', function() {
      expect(shape.model.left).toEqual(50);
    });

    it('sets shape midpoint x to 24', function() {
      expect(shape.midPointX).toEqual(24);
    });

    it('sets shape midpoint y to 24', function() {
      expect(shape.midPointY).toEqual(24);
    });

    it('sets shape rotation to 0', function() {
      expect(shape.model.rotation).toEqual(0);
    });

    it('creates shape path of a 50 x 50 box', function() {
      expect(shape.model.path).toEqual('M0,0L50,0L50,50L0,50z');
    });

    it('returns the shape from the binding expression', function() {
      expect(passedShapeFromDoneFunction).toBe(shape);
    });
  });
});