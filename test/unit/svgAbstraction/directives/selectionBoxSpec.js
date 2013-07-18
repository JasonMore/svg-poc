describe('selectionBox', function () {
  var element,
    scope,
    controller;

  beforeEach(module('svgAbstraction'));

  beforeEach(inject(function ($rootScope, $compile, $controller) {
    element = angular.element(
      '<ng-svg style="height: 600px">' +
        ' <selection-box shape="selectedShape"></selection-box>' +
        '</ng-svg>');

    scope = $rootScope;
    $compile(element)(scope);
  }));

  describe('when there is a selected shape', function() {
    beforeEach(function () {
      scope.shape = {};
    });

    it('draws a box around shape');
    it('box top is above shape');
    it('box left is to the left of shape');
    it('box bottom is below shape');
    it('box right is right of shape');
  });
});