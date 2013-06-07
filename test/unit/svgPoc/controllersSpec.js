'use strict';

describe('Controller: mainCtrl', function () {

  // load the controller's module
  beforeEach(module('svgPoc'));

  var mainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    mainCtrl = $controller('mainCtrl', {
      $scope: scope
    });
  }));

  it('should be able to make controller', function () {
    expect(mainCtrl).not.toBe(null);
  });

  it('should 1 === 1', function() {
    expect(1).toBe(1);
  });
});
