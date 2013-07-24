describe('selectionBoxSpec.js', function () {
  var element,
    scope,
    selectionBox,
    selectionBoxGroup,
    selectionBoxLine;

  beforeEach(module('svgAbstraction'));

  beforeEach(module('svgAbstraction', function ($provide) {
    $provide.service('pathService', function () {
      this.getSelectionBox = function (shape) {
        return selectionBox;
      }
    });
  }));

  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element(
      '<ng-svg style="height: 600px">' +
        ' <selection-box shape="selectedShape"></selection-box>' +
        '<ng-shape model="shape"' +
        ' draggable="canDragShape(shape)"' +
        ' when-click="setSelectedShape(shape)"' +
        ' ng-repeat="shape in shapes"' +
        '></ng-shape>' +
        '</ng-svg>');

    scope = $rootScope;
    $compile(element)(scope);
  }));

  describe('when there is a selected shape', function () {
    beforeEach(function () {
      scope.shapes = [{
        top:100,
        left:100,
        rotation: 75,
        midPointX: 50,
        midPointY: 50,
        path:'M0,0L100,0L100,100L0,100z',
        backgroundColor:'gray',
        borderColor:'black',
        borderWidth: 2
      }];

      scope.selectedShape = scope.shapes[0];

      selectionBox = {
        x:99,
        y:99,
        width:104,
        height:104
      };

      scope.$digest();

      selectionBoxGroup = element.find('g.selection g');
      selectionBoxLine = selectionBoxGroup.find('path');
    });

    it('creates a selection box', function () {
      expect(selectionBoxGroup.length).toEqual(1);
    });

    it('draws a box around shape with 1px line width buffer for top and left', function () {
      expect(selectionBoxGroup.attr('transform')).toEqual('translate(99,99), rotate(75,50,50)');
    });

    it('box width/height is 100 width + 4px line width', function () {
      expect(selectionBoxLine.attr('d')).toEqual('M0,0L104,0L104,104L0,104z');
    });
  });

  describe('when no selected shape', function() {
    beforeEach(function() {
      scope.shape = {
        top:100,
        left:100,
        midPointX: 50,
        midPointY: 50,
        path:'M0,0L100,0L100,100L0,100z',
        backgroundColor:'gray',
        borderColor:'black',
        borderWidth: 2
      };

      scope.selectedShape = null;

      scope.$digest();
      selectionBoxGroup = element.find('g.selection g');
    });

    it('creates a selection box', function () {
      expect(selectionBoxGroup.length).toEqual(1);
    });

    it('selection box is not visible', function () {
      expect(selectionBoxGroup.is(':visible')).toBeFalsy();
    });
  });
});