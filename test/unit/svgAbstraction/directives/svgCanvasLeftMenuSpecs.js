describe('svgCanvasLeftMenu.js >', function() {
  var $scope, svgCanvasLeftMenuCtrl,
    noop = function() {};

  beforeEach(module('svg-poc'));

  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    svgCanvasLeftMenuCtrl = $controller('svgCanvasLeftMenuCtrl', {$scope:$scope});
  }));

  describe('re-ordering shapes >', function () {
    var shape;

    beforeEach(function () {
      $scope.liveShapes = {del:noop};
      spyOn($scope.liveShapes,'del');

      $scope.shapes = {
        'shapeAlpha': {
          model: {
            order: 0
          }
        },
        'shapeBeta': {
          model: {
            id:'beta',
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
        $scope.moveUp($scope.shapes.shapeCharlie);
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
        $scope.moveDown($scope.shapes.shapeCharlie);
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
        $scope.moveDown($scope.shapes.shapeBeta);
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
      beforeEach(function () {
        $scope.moveToTop($scope.shapes.shapeBeta);
      });

      it('alpha stays 0', function() {
        expect($scope.shapes.shapeAlpha.model.order).toEqual(0);
      });
      it('beta moves from 1 to 3', function() {
        expect($scope.shapes.shapeBeta.model.order).toEqual(3);
      });
      it('charlie moves from 2 to 1', function () {
        expect($scope.shapes.shapeCharlie.model.order).toEqual(1);
      });
      it('delta moves from 3 to 2', function() {
        expect($scope.shapes.shapeDelta.model.order).toEqual(2);
      });
    });

    describe('to bottom >', function () {
      beforeEach(function () {
        $scope.moveToBottom($scope.shapes.shapeCharlie);
      });

      it('alpha moves from 0 to 1', function() {
        expect($scope.shapes.shapeAlpha.model.order).toEqual(1);
      });
      it('beta moves from 1 to 2', function() {
        expect($scope.shapes.shapeBeta.model.order).toEqual(2);
      });
      it('charlie moves from 2 to 0', function () {
        expect($scope.shapes.shapeCharlie.model.order).toEqual(0);
      });
      it('delta stays 3', function() {
        expect($scope.shapes.shapeDelta.model.order).toEqual(3);
      });
    });

    describe('deleting shape >', function() {
      beforeEach(function () {
        $scope.deleteShape($scope.shapes.shapeBeta);
      });

      it('alpha stays at 0', function() {
        expect($scope.shapes.shapeAlpha.model.order).toEqual(0);
      });

      it('charlie moves from 2 to 1', function () {
        expect($scope.shapes.shapeCharlie.model.order).toEqual(1);
      });
      it('delta moves from 3 to 2', function() {
        expect($scope.shapes.shapeDelta.model.order).toEqual(2);
      });

      it('calls liveshapes del', function() {
        expect($scope.liveShapes.del).toHaveBeenCalledWith('beta');
      });
    });
  })
});