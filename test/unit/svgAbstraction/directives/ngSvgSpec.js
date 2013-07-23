describe('ngSvgSpec.js', function() {
  var element,
    scope,
    controller;

  beforeEach(module('svgAbstraction'));

  beforeEach(inject(function($rootScope, $compile, $controller){
    element = angular.element('<ng-svg></ng-svg>');
    scope = $rootScope;
    controller = $controller('ngSvgController', {$element: element});

    $compile(element)(scope);
  }));

  it('creates real svg element', function() {
    var svg = element.find('svg');
    expect(svg.length).toBe(1);
  });

  it('sets jquery.svg element on controller', function() {
    expect(controller.svg).toBeDefined();
  });

  it('creates a shapes group', function() {
    expect(element.find('g.shapes').length).toEqual(1);
  });

  it('creates a selection group', function () {
    expect(element.find('g.selection').length).toEqual(1);
  });

//  describe('get selection box', function () {
//    var act,
//      svgShape,
//      selectionBox,
//      strokeWidth;
//
//    act = function() {
//      svgShape = controller.svg.path('M50,25L150,25L150,100L50,100z', {
//        'stroke-width': strokeWidth
//      });
//      selectionBox = controller.getSelectionBox(svgShape);
//    }
//
//    describe('when svg shape has no width', function () {
//      beforeEach(function () {
//        strokeWidth = 0
//        act();
//      });
//
//      it('x is 50', function() {
//        expect(selectionBox.x).toEqual(50);
//      });
//
//      it('y is 25', function() {
//        expect(selectionBox.y).toEqual(25);
//      });
//
//      it('width is 100', function() {
//        expect(selectionBox.width).toEqual(100);
//      });
//
//      it('height is 75', function() {
//        expect(selectionBox.height).toEqual(75);
//      });
//    });
//
//    describe('svg shape has stroke width 10', function() {
//      beforeEach(function () {
//        strokeWidth = 10
//        act();
//      });
//
//      // x and y subtract 1/2 of width
//      it('x is 45', function() {
//        expect(selectionBox.x).toEqual(45);
//      });
//
//      it('y is 20', function() {
//        expect(selectionBox.y).toEqual(20);
//      });
//
//      // width and height add total stroke width
//      it('width is 110', function() {
//        expect(selectionBox.width).toEqual(110);
//      });
//
//      it('height is 85', function() {
//        expect(selectionBox.height).toEqual(85);
//      });
//    });
//  });
});
