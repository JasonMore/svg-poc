describe('selectionBoxSpec.js', function () {
  var element,
    scope,
    selectionBox;

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
        '<shape top="shape.top"' +
        ' left="shape.left"' +
        ' mid-point-x="shape.middleX"' +
        ' mid-point-y="shape.middleY"' +
        ' d="shape.path"' +
        ' fill="shape.backgroundColor"' +
        ' stroke="shape.borderColor"' +
        ' stroke-width="shape.borderWidth"' +
        ' draggable="canDragShape(shape)"' +
        ' svg-element="shape.svgElement"' +
        ' when-click="setSelectedShape(shape)"' +
        '></shape>' +

        '</ng-svg>');

    scope = $rootScope;
    $compile(element)(scope);
  }));

  describe('when there is a selected shape', function () {
    var selectionBoxGroup,
      selectionBoxLine;

    beforeEach(function () {
      scope.shape = {
        top:100,
        left:100,
        middleX: 50,
        middleY: 50,
        path:'M0,0L100,0L100,100L0,100z',
        backgroundColor:'gray',
        borderColor:'black',
        borderWidth: 2
      };

      scope.selectedShape = scope.shape;

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
      expect(selectionBoxGroup.attr('transform')).toEqual('translate(99,99), rotate(0,50,50)');
    });

    it('box width/height is 100 width + 4px line width', function () {
      expect(selectionBoxLine.attr('d')).toEqual('M0,0L104,0L104,104L0,104z')
    });
  });
});