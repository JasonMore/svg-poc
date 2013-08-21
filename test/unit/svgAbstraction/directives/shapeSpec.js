describe('shapeSpec.js', function () {
  var htmlToRender,
    act,
    element,
    scope,
    selectionBox,
    timeout;

  beforeEach(module('svgAbstraction'));

  beforeEach(module('svgAbstraction', function ($provide) {
    $provide.service('pathService', function () {
      this.getSelectionBox = function (shape) {
        return selectionBox;
      }
    });
  }));

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
      path,
      shape,
      picture,
      text;

    describe('array of shapes', function () {
      beforeEach(function () {
        htmlToRender =
          '<ng-svg style="height: 600px">' +
            '<ng-shape view-model="shape"' +
            ' draggable="canDragShape(shape)"' +
            ' when-click="setSelectedShape(shape)"' +
            ' ng-repeat="shape in shapes"' +
            '></ng-shape>' +
            '</ng-svg>';

        act();

        scope.shapes = [
          {model: {
            top: 50,
            left: 50,
            rotation: 45,
            path: 'M0,0L100,0L100,100L0,100z',
            backgroundColor: 'green',
            borderColor: 'blue',
            borderWidth: 12
          }},
          {model: {
            top: 100,
            left: 100,
            rotation: 75,
            path: 'M0,0L100,0L100,100L0,100z',
            backgroundColor: 'gray',
            borderColor: 'black',
            borderWidth: 2,
            image: {
              url: 'someurl',
              x: 10,
              y: 15,
              width: 100,
              height: 150
            }
          }}
        ];

        selectionBox = {
          x: 99,
          y: 99,
          width: 104,
          height: 104
        };

        scope.$digest();
        parentGroup = element.find('g.shapes g:last');
        path = element.find('#paths path:last');
        shape = parentGroup.find('.shape');
        picture = parentGroup.find('image');
        text = parentGroup.find('text');
      });

      it('is on screen', function () {
        expect(parentGroup.length).toBe(1);
      });

      it('parent group has correct transformation', function () {
        timeout.flush();
        expect(parentGroup.attr('transform')).toEqual('translate(100,100), rotate(75,51,51)');
      });

      it('parent group has path', function () {
        expect(shape.length).toBe(2);
      });

      it('shape has correct path', function () {
        expect(path.attr('d')).toEqual('M0,0L100,0L100,100L0,100z');
      });

      it('shape has background color green', function () {
        expect(shape.first().attr('fill')).toEqual('gray');
      });

      it('shape has border color blue', function () {
        expect(shape.last().attr('stroke')).toEqual('black');
      });

      it('shape has border width of 12', function () {
        expect(shape.last().attr('stroke-width')).toEqual('2');
      });

      it('svg element is set on shape', function () {
        expect(scope.shapes[1].svgElement).toEqual(parentGroup[0]);
      });

      it('path def is set on shape', function () {
        expect(scope.shapes[1].svgElementPath).toEqual(path[0]);
      });

      it('renders a picture', function () {
        expect(picture[0]).toBeDefined();
      });

      it('picture has correct href', function () {
        expect(picture.attr('href')).toContain('someurl');
      });

      it('picture x is 10', function () {
        expect(picture.attr('x')).toEqual('10');
      });

      it('picture y is 15', function () {
        expect(picture.attr('y')).toEqual('15');
      });

      it('picture width 100', function () {
        expect(picture.attr('width')).toEqual('100');
      });

      it('picture height 150', function () {
        expect(picture.attr('height')).toEqual('150');
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
  });
});