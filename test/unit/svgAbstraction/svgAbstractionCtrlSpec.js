describe('svgAbstractionCtrl.js >', function() {
  var $scope, svgAbstractionCtrl;


  beforeEach(useMock('service', 'liveResource', window.liveResourceMock));
  beforeEach(module('liveResource'));

  beforeEach(module('main'));
  beforeEach(module('svgAbstraction'));

  beforeEach(inject(function($rootScope, $controller) {
    $scope = $rootScope;
    svgAbstractionCtrl = $controller('svgAbstractionCtrl', {$scope: $scope});
  }));

  describe('copy current shape >', function() {
    var model;

    beforeEach(function() {
      $scope.selectedShape = {
        model: {
          id: 'abc123',
          foo: 'bar'
        }
      };

      // Act
      $scope.copyCurrentShape();
    });

    it('makes a new copy of the selected shape without the id', function() {
      expect($scope.copiedShapeModel).toEqual({foo:'bar'});
    });

    it('is not a reference to the original selected shape', function() {
      expect($scope.copiedShapeModel).not.toBe($scope.selectedShape);
    });
  });

  describe('watching template shapes to create shape view models', function() {
    var act;
    beforeEach(function() {
      $scope.template = {
        shapes: {}
      };

      act = function() {
        $scope.$digest();
      }
    });

    describe('no template shapes', function() {
      beforeEach(function(){
        act();
      });

      it('does not set any shapes', function() {
        expect($scope.shapes).toEqual({});
      });
    });

    describe('adding a shape to template', function() {
      var shapeModel;
      beforeEach(function() {
        shapeModel = {
          id: "abc123",
          foo:'bar'
        };

        $scope.template.shapes['abc123'] = shapeModel;

        act();
      });

      it('adds abc123 viewmodel to shapes', function() {
        expect($scope.shapes['abc123']).toBeDefined();
      });

      it('puts abc123 model on viewmodel', function(){
        expect($scope.shapes['abc123'].model).toBe(shapeModel);
      });

      describe('deleting template shape', function() {
        beforeEach(function() {
          delete $scope.template.shapes['abc123'];
          act();
        });

        it('deletes scope shape viewmodel', function() {
          expect($scope.shapes['abc123']).not.toBeDefined();
        });
      });
    })
  });
});