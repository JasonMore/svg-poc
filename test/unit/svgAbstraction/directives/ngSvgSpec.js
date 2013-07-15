describe('ngSvg', function() {
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
});