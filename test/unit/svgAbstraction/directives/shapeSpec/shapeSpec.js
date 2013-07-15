describe('shape', function() {
  var element,
    scope,
    controller;

  beforeEach(module('svgAbstraction'));
  beforeEach(inject(function ($rootScope, $compile, $templateCache, $controller) {
    $templateCache.get('oneShape.html')

    element = angular.element();
    scope = $rootScope;
    controller = $controller('ngSvgController', {$element: element});

    $compile(element)(scope);
  }));
});