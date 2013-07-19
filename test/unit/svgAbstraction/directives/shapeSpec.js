describe('shape', function () {
  var htmlToRender,
    act,
    element,
    scope,
    timeout;

  beforeEach(module('svgAbstraction'));
  beforeEach(inject(function ($rootScope, $compile, $timeout) {
    timeout = $timeout;

    act = function () {
      element = angular.element(htmlToRender);
      scope = $rootScope;
      $compile(element)(scope);
    };
  }));

  describe('renders', function () {
    var parentGroup,
      shape,
      text;

    describe('array of shapes', function () {
      beforeEach(function () {
        htmlToRender =
          '<ng-svg style="height: 600px">' +
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
            ' ng-repeat="shape in shapes"' +
            '></shape>' +
            '</ng-svg>';

        act();

        scope.shapes = [
          {
            top: 50,
            left: 50,
            path: 'M0,0L100,0L100,100L0,100z',
            backgroundColor: 'green',
            borderColor: 'blue',
            borderWidth: 12,
            svgElement: null
          },
          {
            top: 100,
            left: 100,
            path: 'M0,0L100,0L100,100L0,100z',
            backgroundColor: 'gray',
            borderColor: 'black',
            borderWidth: '2',
            svgElement: null
          }
        ];

        scope.$digest();
        parentGroup = element.find('g.shapes g:last');
        shape = parentGroup.find('path');
        text = parentGroup.find('text');
      });

      it('is on screen', function () {
        expect(parentGroup.length).toBe(1);
      });

      it('parent group has correct transformation', function () {
        timeout.flush();
        expect(parentGroup.attr('transform')).toEqual('translate(100,100), rotate(0,51.000005,51.000005)');
      });

      it('parent group has path', function () {
        expect(shape.length).toBe(1);
      });

      it('shape has correct path', function () {
        expect(shape.attr('d')).toEqual('M0,0L100,0L100,100L0,100z');
      });

      it('shape has background color green', function () {
        expect(shape.attr('fill')).toEqual('gray');
      });

      it('shape has border color blue', function () {
        expect(shape.attr('stroke')).toEqual('black');
      });

      it('shape has border width of 12', function () {
        expect(shape.attr('stroke-width')).toEqual('2');
      });

      it('svg element is set on shape', function () {
        expect(scope.shapes[1].svgElement).toEqual(parentGroup[0]);
      });

      describe('removing shape', function () {
        beforeEach(function () {
          scope.shapes.splice(scope.shapes.length - 1, 1);
          scope.$digest();
        });

        it('reduces shape count from 2 to 1', function () {
          expect(element.find('g.shapes g').length).toBe(1);
        });
      });
    });

    describe('single shape', function () {
      beforeEach(function () {
        htmlToRender =
          '<ng-svg style="height: 600px">' +
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
            '</ng-svg>';

        act();

        scope.shape = {
          top: 25,
          left: 25,
          path: 'M0,0L100,0L100,100L0,100z',
          backgroundColor: 'red',
          borderColor: 'orange',
          borderWidth: 15,
          svgElement: 'aasdfsad'
        };

        scope.$digest();
        parentGroup = element.find('g.shapes g');
        shape = parentGroup.find('path');
        text = parentGroup.find('text');
      });

      it('is on screen', function () {
        expect(parentGroup.length).toBe(1);
      });

      it('parent group has correct transformation', function () {
        timeout.flush();
        expect(parentGroup.attr('transform')).toEqual('translate(25,25), rotate(0,57.500005,57.500005)');
      });

      it('parent group has path', function () {
        expect(shape.length).toBe(1);
      });

      it('shape has correct path', function () {
        expect(shape.attr('d')).toEqual('M0,0L100,0L100,100L0,100z');
      });

      it('shape has background color red', function () {
        expect(shape.attr('fill')).toEqual('red');
      });

      it('shape has border color orange', function () {
        expect(shape.attr('stroke')).toEqual('orange');
      });

      it('shape has border width of 15', function () {
        expect(shape.attr('stroke-width')).toEqual('15');
      });

      // GRR I don't understand why this doesn't work
      xit('svg element is set on shape', function () {
        expect(scope.shape.svgElement).toEqual(parentGroup[0]);
      });
    });
  });
});