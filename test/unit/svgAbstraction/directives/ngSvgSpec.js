describe('ngSvg', function() {
  var element,
    scope;

  beforeEach(module('svgAbstraction'));

  beforeEach(inject(function($rootScope, $compile){
    element = angular.element('<ng-svg></ng-svg>');

    scope = $rootScope;
    $compile(element)(scope);
    scope.$digest();
  }));

  it('creates real svg element', function() {
    var svg = element.find('svg');
    expect(svg.length).toBe(1);
  });
});