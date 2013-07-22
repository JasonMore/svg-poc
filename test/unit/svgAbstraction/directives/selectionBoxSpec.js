describe('selectionBoxSpec.js', function () {
  var element,
    scope,
    timeout;

  beforeEach(module('svgAbstraction'));

  beforeEach(inject(function ($rootScope, $compile, $timeout) {
    timeout = $timeout;

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
    var selectionBox;

    beforeEach(function () {
      scope.shape = {
        top:100,
        left:100,
        path:'M0,0L100,0L100,100L0,100z',
        backgroundColor:'gray',
        borderColor:'black',
        borderWidth:'2'
      };

      scope.selectedShape = scope.shape;

      scope.$digest();

      selectionBox = element.find('g.selection g');
    });

    it('creates a selection box', function () {
      expect(selectionBox.length).toEqual(1);
    });

    it('draws a box around shape with 1px line width buffer', function() {
      timeout.flush();
      expect(selectionBox.attr('transform')).toEqual('translate(99,99), rotate(0,51.000003814697266,51)');
    });

    it('box top is above shape');
    it('box left is to the left of shape');
    it('box bottom is below shape');
    it('box right is right of shape');
  });
});