describe('svgAbstractionCtrl.js >', function() {
  var $scope, svgAbstractionCtrl, shapeViewModelService;


  beforeEach(useMock('service', 'liveResource', window.liveResourceMock));
  beforeEach(module('liveResource'));

  beforeEach(module('svg-poc'));

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
      expect($scope.copiedShapeModel).toEqual({foo: 'bar'});
    });

    it('is not a reference to the original selected shape', function() {
      expect($scope.copiedShapeModel).not.toBe($scope.selectedShape);
    });
  });

  describe('watching template shapes to create shape view models >', function() {
    beforeEach(function() {
      $scope.template = {
        shapes: {}
      };
    });

    describe('no template shapes >', function() {
      beforeEach(function() {
        $scope.$digest(); //Act
      });

      it('does not set any shapes', function() {
        expect($scope.shapes).toEqual({});
      });
    });

    describe('adding a shape to template >', function() {
      var shapeModel;
      beforeEach(function() {
        shapeModel = {
          id: "abc123",
          foo: 'bar'
        };

        $scope.template.shapes['abc123'] = shapeModel;

        $scope.$digest(); //Act
      });

      it('adds abc123 viewmodel to shapes', function() {
        expect($scope.shapes['abc123']).toBeDefined();
      });

      it('puts abc123 model on viewmodel', function() {
        expect($scope.shapes['abc123'].model).toBe(shapeModel);
      });

      describe('deleting template shape >', function() {
        beforeEach(function() {
          delete $scope.template.shapes['abc123'];
          $scope.$digest(); //Act
        });

        it('deletes scope shape viewmodel', function() {
          expect($scope.shapes['abc123']).not.toBeDefined();
        });
      });
    })
  });

  describe('merge data >', function() {
    var dataMergeService, mergedShapesFromData;

    beforeEach(function() {
      $scope.mergeDataId = null;
      $scope.$digest(); //Act
    });

    beforeEach(inject(function(_dataMergeService_, _shapeViewModelService_) {
      dataMergeService = _dataMergeService_;
      shapeViewModelService = _shapeViewModelService_;

      $scope.template.shapes = {
        'abc123': {
          id: 'abc123',
          foo: 'bar',
          color: 'green'
        }
      };

      mergedShapesFromData = {};

      spyOn(dataMergeService, 'shapesWithData').andReturn(mergedShapesFromData);

      $scope.mergeDataId = 'student123';
    }));

    describe('with no merged data >', function() {
      beforeEach(function() {
        $scope.$digest(); //Act
      });

      it('creates copy of shapes', function() {
        expect($scope.shapesCopy).toEqual($scope.template.shapes);
      });

      it('copy is not a reference', function() {
        expect($scope.shapesCopy).not.toBe($scope.template.shapes);
      });

      it('creates a templated shape viewmodel with no changes', function() {
        expect($scope.templatedShapes['abc123'].model).toEqual($scope.template.shapes['abc123']);
      });
    });

    describe('with merged data >', function() {
      beforeEach(function() {
        mergedShapesFromData['abc123'] = {
          id: 'abc123',
          foo: 'hello world',
          color: 'green'
        };

        // real calls are mocked above
        $scope.students = {
          'student123': {},
          'student456': {}
        };

        $scope.$digest(); //Act
      });

      it('updates foo to hello world', function() {
        expect($scope.templatedShapes['abc123'].model.foo).toEqual('hello world');
      });

      it('merges data from original shapes, not copy', function() {
        expect(dataMergeService.shapesWithData)
          .toHaveBeenCalledWith($scope.template.shapes, $scope.students['student123']);
      });

      describe('second merge on different properties >', function() {
        beforeEach(function() {
          spyOn(shapeViewModelService, 'create');

          mergedShapesFromData['abc123'] = {
            id: 'abc123',
            foo: 'bar',
            color: 'black'
          };

          $scope.mergeDataId = 'student456';

          $scope.$digest();
        });

        it('does not create new viewmodels', function() {
          expect(shapeViewModelService.create).not.toHaveBeenCalled();
        });

        it('sets default values back', function() {
          expect($scope.templatedShapes['abc123'].model.foo).toEqual('bar');
        });

        it('updates color', function() {
          expect($scope.templatedShapes['abc123'].model.color).toEqual('black');
        });
      });
    });
  });
});