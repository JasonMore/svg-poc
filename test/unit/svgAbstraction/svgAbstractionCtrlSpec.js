describe('svgAbstractionCtrl.js >', function () {
  var $scope, svgAbstractionCtrl;

  beforeEach(module('main'));
  beforeEach(module('liveResource'));
  beforeEach(module('svgAbstraction'));

  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope;
    svgAbstractionCtrl = $controller('svgAbstractionCtrl', {$scope:$scope});
  }));

  describe('re-ordering shapes >', function () {
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

    describe('can move down >', function() {
      it('can not move alpha down', function() {
        expect($scope.canMoveDown($scope.shapes.shapeAlpha)).toBeFalsy();
      });it('can move beta down', function() {
        expect($scope.canMoveDown($scope.shapes.shapeBeta)).toBeTruthy();
      });
    });

    describe('can move up >', function() {
      it('can move charlie up', function() {
        expect($scope.canMoveUp($scope.shapes.shapeAlpha)).toBeTruthy();
      });it('can not move delta up', function() {
        expect($scope.canMoveUp($scope.shapes.shapeDelta)).toBeFalsy();
      });
    });

    describe('charlie up one >', function () {
      beforeEach(function () {
        shape = $scope.shapes.shapeCharlie;
        $scope.moveUp(shape);
      });

      it('alpha stays 0', function() {
        expect($scope.shapes.shapeAlpha.model.order).toEqual(0);
      });
      it('beta stays 1', function() {
        expect($scope.shapes.shapeBeta.model.order).toEqual(1);
      });
      it('moves charlie from 2 to 3', function () {
        expect($scope.shapes.shapeCharlie.model.order).toEqual(3);
      });
      it('moves delta from 3 to 2', function() {
        expect($scope.shapes.shapeDelta.model.order).toEqual(2);
      });
    });

    describe('charlie down one >', function () {
      beforeEach(function () {
        shape = $scope.shapes.shapeCharlie;
        $scope.moveDown(shape);
      });

      it('alpha stays 0', function() {
        expect($scope.shapes.shapeAlpha.model.order).toEqual(0);
      });
      it('beta moves from 1 to 2', function() {
        expect($scope.shapes.shapeBeta.model.order).toEqual(2);
      });
      it('moves charlie from 2 to 1', function () {
        expect($scope.shapes.shapeCharlie.model.order).toEqual(1);
      });
      it('delta stays 3', function() {
        expect($scope.shapes.shapeDelta.model.order).toEqual(3);
      });
    });

    describe('beta down one >', function () {
      beforeEach(function () {
        shape = $scope.shapes.shapeBeta;
        $scope.moveDown(shape);
      });

      it('alpha moves from 0 to 1', function() {
        expect($scope.shapes.shapeAlpha.model.order).toEqual(1);
      });
      it('beta moves from 1 to 0', function() {
        expect($scope.shapes.shapeBeta.model.order).toEqual(0);
      });
      it('charlie stays 2', function () {
        expect($scope.shapes.shapeCharlie.model.order).toEqual(2);
      });
      it('delta stays 3', function() {
        expect($scope.shapes.shapeDelta.model.order).toEqual(3);
      });
    });

    describe('to top >', function () {

    });

    describe('to bottom >', function () {

    });
  })
});