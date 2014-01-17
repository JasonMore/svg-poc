describe('svgAbstractionCtrl.js >', function () {
  var $scope, svgAbstractionCtrl;


  beforeEach(useMock('service', 'liveResource', window.liveResourceMock));
  beforeEach(module('liveResource'));

  beforeEach(module('main'));
  beforeEach(module('svgAbstraction'));

  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope;
    svgAbstractionCtrl = $controller('svgAbstractionCtrl', {$scope:$scope});
  }));
});