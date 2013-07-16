describe('shape', function () {
  var htmlToRender,
    act,
    element,
    scope;

  beforeEach(module('svgAbstraction'));
  beforeEach(inject(function ($rootScope, $compile, $controller) {
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
            'left="shape.left"' +
            'd="shape.path"' +
            'fill="shape.backgroundColor"' +
            'stroke="shape.borderColor"' +
            'stroke-width="shape.borderWidth"' +
            'ng-repeat="shape in shapes"' +
            '></shape>' +
            '</ng-svg>'

        act();

        scope.shapes = [
          {
            top:50,
            left:50,
            path:'M0,0L100,0L100,100L0,100z',
            backgroundColor:'green',
            borderColor:'blue',
            borderWidth:12
          },
          {
            top:100,
            left:100,
            path:'M0,0L100,0L100,100L0,100z',
            backgroundColor:'gray',
            borderColor:'black',
            borderWidth:'2'
          }
        ];

        scope.$digest();
        parentGroup = element.find('g:last');
        shape = parentGroup.find('path');
        text = parentGroup.find('text');
      });

      it('is on screen', function () {
        expect(parentGroup.length).toBe(1);
      });

      it('parent group has correct transformation', function () {
        expect(parentGroup.attr('transform')).toEqual('translate(100,100), rotate(0,50,50)');
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

      describe('removing shape', function () {
        beforeEach(function () {
          scope.shapes.splice(scope.shapes.length - 1, 1);
          scope.$digest();
        });

        it('reduces shape count from 2 to 1', function () {
          expect(element.find('g').length).toBe(1);
        });
      });
    });

    describe('single shape', function () {
      beforeEach(function () {
        htmlToRender =
          '<ng-svg style="height: 600px">' +
            '<shape top="shape.top"' +
            'left="shape.left"' +
            'd="shape.path"' +
            'fill="shape.backgroundColor"' +
            'stroke="shape.borderColor"' +
            'stroke-width="shape.borderWidth"' +
            '></shape>' +
            '</ng-svg>'

        act();

        scope.shape = {
          top:50,
          left:50,
          path:'M0,0L100,0L100,100L0,100z',
          backgroundColor:'green',
          borderColor:'blue',
          borderWidth:12
        };

        scope.$digest();
        parentGroup = element.find('g');
        shape = parentGroup.find('path');
        text = parentGroup.find('text');
      });

      it('is on screen', function () {
        expect(parentGroup.length).toBe(1);
      });

      it('parent group has correct transformation', function () {
        expect(parentGroup.attr('transform')).toEqual('translate(50,50), rotate(0,50,50)');
      });

      it('parent group has path', function () {
        expect(shape.length).toBe(1);
      });

      it('shape has correct path', function () {
        expect(shape.attr('d')).toEqual('M0,0L100,0L100,100L0,100z');
      });

      it('shape has background color green', function () {
        expect(shape.attr('fill')).toEqual('green');
      });

      it('shape has border color blue', function () {
        expect(shape.attr('stroke')).toEqual('blue');
      });

      it('shape has border width of 12', function () {
        expect(shape.attr('stroke-width')).toEqual('12');
      });
    });
  });


});