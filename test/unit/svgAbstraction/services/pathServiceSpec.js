describe('pathServiceSpec.js', function () {
  var svg;

  beforeEach(function() {
    this.addMatchers({
      // Checks if number is within +/- 1
      toBeCloseTo: function(expected) {
        return (this.actual - 1) < expected && (this.actual + 1) > expected;
      }
    })
  });

  beforeEach(module('svgAbstraction'));
  beforeEach(function() {
    $('<div></div>').svg({onLoad: function(svgWrapper){
      svg = svgWrapper;
    }});
  });

  describe('get selection box', function () {
    var act,
      shape,
      selectionBox,
      strokeWidth;

    beforeEach(inject(function (pathService) {
      act = function () {
        selectionBox = pathService.getSelectionBox(shape);
      };
    }));

    describe('when shape is a square', function() {
      beforeEach(function() {
        shape = svg.path('M0,0L100,0L100,100L0,100z', {
          'stroke-width': strokeWidth
        });
      });

      describe('and has no stroke width', function() {
        beforeEach(function() {
          strokeWidth = 0;
          act();
        });

        it('x is 0', function() {
          expect(selectionBox.x).toEqual(0);
        });

        it('y is 0', function() {
          expect(selectionBox.y).toEqual(0);
        });

        it('width is 100', function() {
          expect(selectionBox.width).toBeCloseTo(100);
        });

        it('height is 100', function() {
          expect(selectionBox.height).toBeCloseTo(100);
        });
      });

      describe('and has stroke width 10', function() {
        beforeEach(function() {
          strokeWidth = 10;
          act();
        });

        // x and y subtract 1/2 of width
        it('x is 0', function() {
          expect(selectionBox.x).toEqual(0);
        });

        it('y is -5', function() {
          expect(selectionBox.y).toEqual(-5);
        });

        // width and height add total stroke width
        it('width is 110', function() {
          expect(selectionBox.width).toBeCloseTo(110);
        });

        it('height is 110', function() {
          expect(selectionBox.height).toBeCloseTo(110);
        });
      });

    });

  });
});