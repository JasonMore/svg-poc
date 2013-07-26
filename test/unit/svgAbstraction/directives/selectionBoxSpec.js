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
  }));

  describe('when no selected shape', function() {
    beforeEach(function() {
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


  describe('when there is a selected shape', function () {
    beforeEach(function () {
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
      expect(selectionBoxGroup.attr('transform')).toEqual('translate(99,99), rotate(75,51,51)');
    });

    it('box width/height is 100 width + 4px line width', function () {
      expect(selectionBoxLine.attr('d')).toEqual('M0,0L104,0L104,104L0,104z');
    });
  });

  describe('when resizing', function() {
    var act,
      corner,
      move;

    beforeEach(function () {
      scope.shapes[0].rotation = 0;
      scope.selectedShape = scope.shapes[0];

      selectionBox = {
        x:100,
        y:100,
        width:100,
        height:100
      };

      scope.$digest();

      selectionBoxGroup = element.find('g.selection g');
      selectionBoxLine = selectionBoxGroup.find('path');

      act = function() {
        var ctm = corner[0].getScreenCTM();

        var drag = {
          which:1,
          pageX:ctm.e,
          pageY:ctm.f
        };

        var mouseDown = $.Event('mousedown', drag);

        drag.pageX += move.x;
        drag.pageY += move.y;

        var mousemove = $.Event("mousemove.draggable", drag);
        var mouseup = $.Event("mouseup.draggable", drag);

        corner.trigger(mouseDown);
        $(document).trigger(mousemove);
        $(document).trigger(mouseup);
        $(document).trigger($.Event("mouseup"));

        scope.$digest();
      }
    });

    describe('nw corner', function() {
      beforeEach(function () {
        corner = selectionBoxGroup.find('#cornerNW');
      });
      describe('down and right', function() {
        beforeEach(function () {
          move = { x: 10, y: 10 };
          act();
        });

        it('decreases outline height and width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L90,0L90,90L0,90z');
        });

        it('increases shape top', function() {
          expect(scope.shapes[0].top).toEqual(110);
        });

        it('increases shape left', function() {
          expect(scope.shapes[0].left).toEqual(110);
        });

        it('decreases shape width', function() {
          expect(scope.shapes[0].width).toEqual(90);
        });

        it('decreases shape height', function() {
          expect(scope.shapes[0].height).toEqual(90);
        });

        it('decreases shape midpointX including border width', function() {
          expect(scope.shapes[0].midPointX).toEqual(44);
        });

        it('decreases shape midpointY including border width', function() {
          expect(scope.shapes[0].midPointY).toEqual(44);
        });

        it('shape rotation stays the same', function() {
          expect(scope.shapes[0].rotation).toEqual(0);
        });

        it('decreases shape height and width by 10', function() {
          expect(scope.shapes[0].path).toEqual('M0,0L89.796,0L89.796,89.796L0,89.796z');
        });
      });
      describe('up and left', function() {
        beforeEach(function () {
          move = { x: -10, y: -10 };
          act();
        });

        it('increases outline height and width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L110,0L110,110L0,110z');
        });

        it('decreases shape top', function() {
          expect(scope.shapes[0].top).toEqual(90);
        });

        it('decreases shape left', function() {
          expect(scope.shapes[0].left).toEqual(90);
        });

        it('increases shape width', function() {
          expect(scope.shapes[0].width).toEqual(110);
        });

        it('increases shape height', function() {
          expect(scope.shapes[0].height).toEqual(110);
        });

        it('increases shape midpointX including border width', function() {
          expect(scope.shapes[0].midPointX).toEqual(54);
        });

        it('increases shape midpointY including border width', function() {
          expect(scope.shapes[0].midPointY).toEqual(54);
        });

        it('shape rotation stays the same', function() {
          expect(scope.shapes[0].rotation).toEqual(0);
        });

        it('increases shape height and width by 10', function() {
          expect(scope.shapes[0].path).toEqual('M0,0L110.204,0L110.204,110.204L0,110.204z');
        });

      });
    });

    describe('ne corner', function() {
      beforeEach(function () {
        corner = selectionBoxGroup.find('#cornerNE');
      });
      describe('down and right', function() {
        beforeEach(function () {
          move = { x: 10, y: 10 };
          act();
        });

        it('decreases outline height and increases width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L110,0L110,90L0,90z');
        });

        it('increases shape top', function() {
          expect(scope.shapes[0].top).toEqual(110);
        });

        it('shape left stays the same', function() {
          expect(scope.shapes[0].left).toEqual(100);
        });

        it('increases shape width', function() {
          expect(scope.shapes[0].width).toEqual(110);
        });

        it('decreases shape height', function() {
          expect(scope.shapes[0].height).toEqual(90);
        });

        it('increases shape midpointX including border width', function() {
          expect(scope.shapes[0].midPointX).toEqual(54);
        });

        it('decreases shape midpointY including border width', function() {
          expect(scope.shapes[0].midPointY).toEqual(44);
        });

        it('shape rotation stays the same', function() {
          expect(scope.shapes[0].rotation).toEqual(0);
        });

        it('decreases shape height and increases width by 10', function() {
          expect(scope.shapes[0].path).toEqual('M0,0L110.204,0L110.204,89.796L0,89.796z');
        });

      });
      describe('up and left', function() {
        beforeEach(function () {
          move = { x: -10, y: -10 };
          act();
        });

        it('increases outline height and decreases width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L90,0L90,110L0,110z');
        });

        it('decreases shape top', function() {
          expect(scope.shapes[0].top).toEqual(90);
        });

        it('shape left stays the same', function() {
          expect(scope.shapes[0].left).toEqual(100);
        });

        it('decreases shape width', function() {
          expect(scope.shapes[0].width).toEqual(90);
        });

        it('increases shape height', function() {
          expect(scope.shapes[0].height).toEqual(110);
        });

        it('decreases shape midpointX including border width', function() {
          expect(scope.shapes[0].midPointX).toEqual(44);
        });

        it('increases shape midpointY including border width', function() {
          expect(scope.shapes[0].midPointY).toEqual(54);
        });

        it('shape rotation stays the same', function() {
          expect(scope.shapes[0].rotation).toEqual(0);
        });

        it('increases height and decreases width by 10', function() {
          expect(scope.shapes[0].path).toEqual('M0,0L89.796,0L89.796,110.204L0,110.204z');
        });


      });
    });

    describe('se corner', function() {
      beforeEach(function () {
        corner = selectionBoxGroup.find('#cornerSE');
      });
      describe('down and right', function() {
        beforeEach(function () {
          move = { x: 10, y: 10 };
          act();
        });

        it('increases outline height and width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L110,0L110,110L0,110z');
        });

        it('shape top stays the same', function() {
          expect(scope.shapes[0].top).toEqual(100);
        });

        it('shape left stays the same', function() {
          expect(scope.shapes[0].left).toEqual(100);
        });

        it('increases shape width', function() {
          expect(scope.shapes[0].width).toEqual(110);
        });

        it('increases shape height', function() {
          expect(scope.shapes[0].height).toEqual(110);
        });

        it('increases shape midpointX including border width', function() {
          expect(scope.shapes[0].midPointX).toEqual(54);
        });

        it('increases shape midpointY including border width', function() {
          expect(scope.shapes[0].midPointY).toEqual(54);
        });

        it('shape rotation stays the same', function() {
          expect(scope.shapes[0].rotation).toEqual(0);
        });

        it('increases shape height and width by 10', function() {
          expect(scope.shapes[0].path).toEqual('M0,0L110.204,0L110.204,110.204L0,110.204z');
        });

      });
      describe('up and left', function() {
        beforeEach(function () {
          move = { x: -10, y: -10 };
          act();
        });

        it('decreases outline height and width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L90,0L90,90L0,90z');
        });

        it('shape top stays the same', function() {
          expect(scope.shapes[0].top).toEqual(100);
        });

        it('shape left stays the same', function() {
          expect(scope.shapes[0].left).toEqual(100);
        });

        it('decreases shape width', function() {
          expect(scope.shapes[0].width).toEqual(90);
        });

        it('decreases shape height', function() {
          expect(scope.shapes[0].height).toEqual(90);
        });

        it('decreases shape midpointX including border width', function() {
          expect(scope.shapes[0].midPointX).toEqual(44);
        });

        it('decreases shape midpointY including border width', function() {
          expect(scope.shapes[0].midPointY).toEqual(44);
        });

        it('shape rotation stays the same', function() {
          expect(scope.shapes[0].rotation).toEqual(0);
        });

        it('decreases shape height and width by 10', function() {
          expect(scope.shapes[0].path).toEqual('M0,0L89.796,0L89.796,89.796L0,89.796z');
        });
      });
    });

    describe('sw corner', function() {
      beforeEach(function () {
        corner = selectionBoxGroup.find('#cornerSW');
      });
      describe('down and right', function() {
        beforeEach(function () {
          move = { x: 10, y: 10 };
          act();
        });

        it('increases outline height and decreases width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L90,0L90,110L0,110z');
        });

        it('shape top stays the same', function() {
          expect(scope.shapes[0].top).toEqual(100);
        });

        it('increases shape left', function() {
          expect(scope.shapes[0].left).toEqual(110);
        });

        it('decreases shape width', function() {
          expect(scope.shapes[0].width).toEqual(90);
        });

        it('increases shape height', function() {
          expect(scope.shapes[0].height).toEqual(110);
        });

        it('decreases shape midpointX including border width', function() {
          expect(scope.shapes[0].midPointX).toEqual(44);
        });

        it('increases shape midpointY including border width', function() {
          expect(scope.shapes[0].midPointY).toEqual(54);
        });

        it('shape rotation stays the same', function() {
          expect(scope.shapes[0].rotation).toEqual(0);
        });

        it('increases shape height and decreases width by 10', function() {
          expect(scope.shapes[0].path).toEqual('M0,0L89.796,0L89.796,110.204L0,110.204z');
        });
      });
      describe('up and left', function() {
        beforeEach(function () {
          move = { x: -10, y: -10 };
          act();
        });

        it('decreases outline height and increases width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L110,0L110,90L0,90z');
        });

        it('shape top stays the same', function() {
          expect(scope.shapes[0].top).toEqual(100);
        });

        it('decreases shape left', function() {
          expect(scope.shapes[0].left).toEqual(90);
        });

        it('increases shape width', function() {
          expect(scope.shapes[0].width).toEqual(110);
        });

        it('decreases shape height', function() {
          expect(scope.shapes[0].height).toEqual(90);
        });

        it('increases shape midpointX including border width', function() {
          expect(scope.shapes[0].midPointX).toEqual(54);
        });

        it('increases shape midpointY including border width', function() {
          expect(scope.shapes[0].midPointY).toEqual(44);
        });

        it('shape rotation stays the same', function() {
          expect(scope.shapes[0].rotation).toEqual(0);
        });

        it('decreases shape height and increases width by 10', function() {
          expect(scope.shapes[0].path).toEqual('M0,0L110.204,0L110.204,89.796L0,89.796z');
        });
      });
    });

    describe('rotation', function() {
      beforeEach(function () {
        corner = selectionBoxGroup.find('#rotator');
      });
      describe('down and right', function() {
        beforeEach(function () {
          move = { x: 150, y: 100 };
          act();
        });

        it('shape top stays the same', function() {
          expect(scope.shapes[0].top).toEqual(100);
        });

        it('shape left stays the same', function() {
          expect(scope.shapes[0].left).toEqual(100);
        });

        it('shape width stays the same', function() {
          expect(scope.shapes[0].width).toEqual(100);
        });

        it('shape height stays the same', function() {
          expect(scope.shapes[0].height).toEqual(100);
        });

        it('shape midpointX stays the same', function() {
          expect(scope.shapes[0].midPointX).toEqual(49);
        });

        it('shape midpointY stays the same', function() {
          expect(scope.shapes[0].midPointY).toEqual(49);
        });

        it('shape rotates box 90 degrees', function() {
          expect(scope.shapes[0].rotation).toEqual(90);
        });
      });
      describe('straight down', function() {
        beforeEach(function () {
          move = { x: -15, y: 200 };
          act();
        });
        it('rotates box 180 degrees', function() {
          expect(scope.shapes[0].rotation).toEqual(-180);
        });
      });
    });

    describe('with rotation 90 degrees', function() {
      beforeEach(function () {
        scope.shapes[0].rotation = 90;
        scope.$digest();
      });

      it('sanity check', function() {
        console.log(selectionBoxGroup.attr('transform'));
      });

      describe('se corner', function() {
        beforeEach(function () {
          corner = selectionBoxGroup.find('#cornerSE');
        });
        describe('down', function() {
          beforeEach(function () {
            move = { x: 0, y: 10 };
            act();
          });

          it('increases outline height and width by 5', function () {
            expect(selectionBoxLine.attr('d')).toEqual('M0,0L105,0L105,105L0,105z');
          });

          it('shape top stays the same', function() {
            expect(scope.shapes[0].top).toEqual(105);
          });

          it('shape left stays the same', function() {
            expect(scope.shapes[0].left).toEqual(105);
          });

          it('increases shape width', function() {
            expect(scope.shapes[0].width).toEqual(105);
          });

          it('increases shape height', function() {
            expect(scope.shapes[0].height).toEqual(105);
          });

//          it('increases shape midpointX including border width', function() {
//            expect(scope.shapes[0].midPointX).toEqual(54);
//          });
//
//          it('increases shape midpointY including border width', function() {
//            expect(scope.shapes[0].midPointY).toEqual(54);
//          });
//
//          it('shape rotation stays the same', function() {
//            expect(scope.shapes[0].rotation).toEqual(0);
//          });
//
//          it('increases shape height and width by 10', function() {
//            expect(scope.shapes[0].path).toEqual('M0,0L110.204,0L110.204,110.204L0,110.204z');
//          });

        });
      });

    });

  });


});