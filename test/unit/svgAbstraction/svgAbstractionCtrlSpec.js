describe('svgAbstractionCtrl.js', function () {
  var $scope, svgAbstractionCtrl;

  beforeEach(module('main'));
  beforeEach(module('liveResource'));
  beforeEach(module('svgAbstraction'));

  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope;
    svgAbstractionCtrl = $controller('svgAbstractionCtrl', {$scope:$scope});
  }));

  describe('re-ordering shapes', function () {
    var shape;

    beforeEach(function () {
      $scope.shapes = {
        'shapeAlpha': {
          model: {
            order: 0
          }
        },
        'shapeBeta': {
          model: {
            order: 1
          }
        },
        'shapeCharlie': {
          model: {
            order: 2
          }
        },
        'shapeDelta': {
          model: {
            order: 3
          }
        }
      };
    });

    describe('up one', function () {
      beforeEach(function () {
        shape = $scope.shapes.shapeCharlie;
        $scope.moveUp(shape);
      });

      it('moves spot 2 to 3', function () {
        expect($scope.shapes.shapeCharlie.model.order).toEqual(3);
      });
      it('moves spot 3 to 2', function() {
        expect($scope.shapes.shapeDelta.model.order).toEqual(2);
      });
      it('spot 0 stays 0', function() {
        expect($scope.shapes.shapeAlpha.model.order).toEqual(0);
      });
      it('spot 1 stays 1', function() {
        expect($scope.shapes.shapeBeta.model.order).toEqual(1);
      });
    });

    describe('down one', function () {

    });

    describe('to top', function () {

    });

    describe('to bottom', function () {

    });
  })
});