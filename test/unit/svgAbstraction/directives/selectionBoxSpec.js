describe('selectionBoxSpec.js', function () {
  var mock,
    element,
    scope,
    selectionBox,
    selectionBoxGroup,
    selectionBoxLine;

  beforeEach(module('svgAbstraction'));

  beforeEach(module('svgAbstraction', function ($provide) {
    $provide.decorator('pathService', function ($delegate) {
      $delegate.getSelectionBox = function (shape) {
        return selectionBox;
      };

      return $delegate;
    });
  }));


  beforeEach(inject(function ($rootScope, $compile) {
    element = angular.element(
      '<ng-svg style="height: 600px">' +
        ' <selection-box shape="selectedShape"></selection-box>' +
        '<ng-shape view-model="shape"' +
        ' draggable="canDragShape(shape)"' +
        ' when-click="setSelectedShape(shape)"' +
        ' ng-repeat="shape in shapes"' +
        '></ng-shape>' +
        '</ng-svg>');

    scope = $rootScope;
    $compile(element)(scope);

    scope.shapes = [
      {
        midPointX: 50,
        midPointY: 50,
        model: {
          top: 100,
          left: 100,
          rotation: 75,
          path: 'M0,0L100,0L100,100L0,100z',
          backgroundColor: 'gray',
          borderColor: 'black',
          borderWidth: 2
        }}
    ];
  }));

  describe('when no selected shape', function () {
    beforeEach(function () {
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
        x: 99,
        y: 99,
        width: 104,
        height: 104
      };

      scope.$digest();

      selectionBoxGroup = element.find('g.selection g');
      selectionBoxLine = selectionBoxGroup.find('path');
    });

    it('creates a selection box', function () {
      expect(selectionBoxGroup.length).toEqual(1);
    });

    it('draws a box around shape with 1px line width buffer for top and left', function () {
      expect(selectionBoxGroup.attr('transform')).toEqual('translate(100,100), rotate(75,50,50)');
    });

    it('box width/height is 100 width + 4px line width', function () {
      expect(selectionBoxLine.attr('d')).toEqual('M0,0L104,0L104,104L0,104z');
    });
  });

  describe('when resizing square', function () {
    var act,
      corner,
      move;

    beforeEach(function () {
      scope.shapes[0].model.rotation = 0;
      scope.selectedShape = scope.shapes[0];

      selectionBox = {
        x: 100,
        y: 100,
        width: 100,
        height: 100
      };

      scope.$digest();

      selectionBoxGroup = element.find('g.selection g');
      selectionBoxLine = selectionBoxGroup.find('path');

      act = function () {
        var ctm = corner[0].getScreenCTM();

        var drag = {
          which: 1,
          pageX: ctm.e,
          pageY: ctm.f
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

    describe('nw corner', function () {
      beforeEach(function () {
        corner = selectionBoxGroup.find('#cornerNW');
      });
      describe('down and right', function () {
        beforeEach(function () {
          move = { x: 10, y: 10 };
          act();
        });

        it('decreases outline height and width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L90,0L90,90L0,90z');
        });

        it('increases shape top', function () {
          expect(scope.shapes[0].model.top).toEqual(110);
        });

        it('increases shape left', function () {
          expect(scope.shapes[0].model.left).toEqual(110);
        });

        it('decreases shape width', function () {
          expect(scope.shapes[0].width).toEqual(90);
        });

        it('decreases shape height', function () {
          expect(scope.shapes[0].height).toEqual(90);
        });

        it('decreases shape midpointX including border width', function () {
          expect(scope.shapes[0].midPointX).toEqual(44);
        });

        it('decreases shape midpointY including border width', function () {
          expect(scope.shapes[0].midPointY).toEqual(44);
        });

        it('shape rotation stays the same', function () {
          expect(scope.shapes[0].model.rotation).toEqual(0);
        });

        it('decreases shape height and width by 10', function () {
          expect(scope.shapes[0].model.path).toEqual('M0,0L89.796,0L89.796,89.796L0,89.796z');
        });
      });
      describe('up and left', function () {
        beforeEach(function () {
          move = { x: -10, y: -10 };
          act();
        });

        it('increases outline height and width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L110,0L110,110L0,110z');
        });

        it('decreases shape top', function () {
          expect(scope.shapes[0].model.top).toEqual(90);
        });

        it('decreases shape left', function () {
          expect(scope.shapes[0].model.left).toEqual(90);
        });

        it('increases shape width', function () {
          expect(scope.shapes[0].width).toEqual(110);
        });

        it('increases shape height', function () {
          expect(scope.shapes[0].height).toEqual(110);
        });

        it('increases shape midpointX including border width', function () {
          expect(scope.shapes[0].midPointX).toEqual(54);
        });

        it('increases shape midpointY including border width', function () {
          expect(scope.shapes[0].midPointY).toEqual(54);
        });

        it('shape rotation stays the same', function () {
          expect(scope.shapes[0].model.rotation).toEqual(0);
        });

        it('increases shape height and width by 10', function () {
          expect(scope.shapes[0].model.path).toEqual('M0,0L110.204,0L110.204,110.204L0,110.204z');
        });

      });
    });

    describe('ne corner', function () {
      beforeEach(function () {
        corner = selectionBoxGroup.find('#cornerNE');
      });
      describe('down and right', function () {
        beforeEach(function () {
          move = { x: 10, y: 10 };
          act();
        });

        it('decreases outline height and increases width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L110,0L110,90L0,90z');
        });

        it('increases shape top', function () {
          expect(scope.shapes[0].model.top).toEqual(110);
        });

        it('shape left stays the same', function () {
          expect(scope.shapes[0].model.left).toEqual(100);
        });

        it('increases shape width', function () {
          expect(scope.shapes[0].width).toEqual(110);
        });

        it('decreases shape height', function () {
          expect(scope.shapes[0].height).toEqual(90);
        });

        it('increases shape midpointX including border width', function () {
          expect(scope.shapes[0].midPointX).toEqual(54);
        });

        it('decreases shape midpointY including border width', function () {
          expect(scope.shapes[0].midPointY).toEqual(44);
        });

        it('shape rotation stays the same', function () {
          expect(scope.shapes[0].model.rotation).toEqual(0);
        });

        it('decreases shape height and increases width by 10', function () {
          expect(scope.shapes[0].model.path).toEqual('M0,0L110.204,0L110.204,89.796L0,89.796z');
        });

      });
      describe('up and left', function () {
        beforeEach(function () {
          move = { x: -10, y: -10 };
          act();
        });

        it('increases outline height and decreases width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L90,0L90,110L0,110z');
        });

        it('decreases shape top', function () {
          expect(scope.shapes[0].model.top).toEqual(90);
        });

        it('shape left stays the same', function () {
          expect(scope.shapes[0].model.left).toEqual(100);
        });

        it('decreases shape width', function () {
          expect(scope.shapes[0].width).toEqual(90);
        });

        it('increases shape height', function () {
          expect(scope.shapes[0].height).toEqual(110);
        });

        it('decreases shape midpointX including border width', function () {
          expect(scope.shapes[0].midPointX).toEqual(44);
        });

        it('increases shape midpointY including border width', function () {
          expect(scope.shapes[0].midPointY).toEqual(54);
        });

        it('shape rotation stays the same', function () {
          expect(scope.shapes[0].model.rotation).toEqual(0);
        });

        it('increases height and decreases width by 10', function () {
          expect(scope.shapes[0].model.path).toEqual('M0,0L89.796,0L89.796,110.204L0,110.204z');
        });


      });
    });

    describe('se corner', function () {
      beforeEach(function () {
        corner = selectionBoxGroup.find('#cornerSE');
      });
      describe('down and right', function () {
        beforeEach(function () {
          move = { x: 10, y: 10 };
          act();
        });

        it('increases outline height and width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L110,0L110,110L0,110z');
        });

        it('shape top stays the same', function () {
          expect(scope.shapes[0].model.top).toEqual(100);
        });

        it('shape left stays the same', function () {
          expect(scope.shapes[0].model.left).toEqual(100);
        });

        it('increases shape width', function () {
          expect(scope.shapes[0].width).toEqual(110);
        });

        it('increases shape height', function () {
          expect(scope.shapes[0].height).toEqual(110);
        });

        it('increases shape midpointX including border width', function () {
          expect(scope.shapes[0].midPointX).toEqual(54);
        });

        it('increases shape midpointY including border width', function () {
          expect(scope.shapes[0].midPointY).toEqual(54);
        });

        it('shape rotation stays the same', function () {
          expect(scope.shapes[0].model.rotation).toEqual(0);
        });

        it('increases shape height and width by 10', function () {
          expect(scope.shapes[0].model.path).toEqual('M0,0L110.204,0L110.204,110.204L0,110.204z');
        });

      });
      describe('up and left', function () {
        beforeEach(function () {
          move = { x: -10, y: -10 };
          act();
        });

        it('decreases outline height and width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L90,0L90,90L0,90z');
        });

        it('shape top stays the same', function () {
          expect(scope.shapes[0].model.top).toEqual(100);
        });

        it('shape left stays the same', function () {
          expect(scope.shapes[0].model.left).toEqual(100);
        });

        it('decreases shape width', function () {
          expect(scope.shapes[0].width).toEqual(90);
        });

        it('decreases shape height', function () {
          expect(scope.shapes[0].height).toEqual(90);
        });

        it('decreases shape midpointX including border width', function () {
          expect(scope.shapes[0].midPointX).toEqual(44);
        });

        it('decreases shape midpointY including border width', function () {
          expect(scope.shapes[0].midPointY).toEqual(44);
        });

        it('shape rotation stays the same', function () {
          expect(scope.shapes[0].model.rotation).toEqual(0);
        });

        it('decreases shape height and width by 10', function () {
          expect(scope.shapes[0].model.path).toEqual('M0,0L89.796,0L89.796,89.796L0,89.796z');
        });
      });
    });

    describe('sw corner', function () {
      beforeEach(function () {
        corner = selectionBoxGroup.find('#cornerSW');
      });
      describe('down and right', function () {
        beforeEach(function () {
          move = { x: 10, y: 10 };
          act();
        });

        it('increases outline height and decreases width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L90,0L90,110L0,110z');
        });

        it('shape top stays the same', function () {
          expect(scope.shapes[0].model.top).toEqual(100);
        });

        it('increases shape left', function () {
          expect(scope.shapes[0].model.left).toEqual(110);
        });

        it('decreases shape width', function () {
          expect(scope.shapes[0].width).toEqual(90);
        });

        it('increases shape height', function () {
          expect(scope.shapes[0].height).toEqual(110);
        });

        it('decreases shape midpointX including border width', function () {
          expect(scope.shapes[0].midPointX).toEqual(44);
        });

        it('increases shape midpointY including border width', function () {
          expect(scope.shapes[0].midPointY).toEqual(54);
        });

        it('shape rotation stays the same', function () {
          expect(scope.shapes[0].model.rotation).toEqual(0);
        });

        it('increases shape height and decreases width by 10', function () {
          expect(scope.shapes[0].model.path).toEqual('M0,0L89.796,0L89.796,110.204L0,110.204z');
        });
      });
      describe('up and left', function () {
        beforeEach(function () {
          move = { x: -10, y: -10 };
          act();
        });

        it('decreases outline height and increases width by 10', function () {
          expect(selectionBoxLine.attr('d')).toEqual('M0,0L110,0L110,90L0,90z');
        });

        it('shape top stays the same', function () {
          expect(scope.shapes[0].model.top).toEqual(100);
        });

        it('decreases shape left', function () {
          expect(scope.shapes[0].model.left).toEqual(90);
        });

        it('increases shape width', function () {
          expect(scope.shapes[0].width).toEqual(110);
        });

        it('decreases shape height', function () {
          expect(scope.shapes[0].height).toEqual(90);
        });

        it('increases shape midpointX including border width', function () {
          expect(scope.shapes[0].midPointX).toEqual(54);
        });

        it('increases shape midpointY including border width', function () {
          expect(scope.shapes[0].midPointY).toEqual(44);
        });

        it('shape rotation stays the same', function () {
          expect(scope.shapes[0].model.rotation).toEqual(0);
        });

        it('decreases shape height and increases width by 10', function () {
          expect(scope.shapes[0].model.path).toEqual('M0,0L110.204,0L110.204,89.796L0,89.796z');
        });
      });
    });

    describe('rotation', function () {
      beforeEach(function () {
        corner = selectionBoxGroup.find('#rotator');
      });
      describe('down and right', function () {
        beforeEach(function () {
          move = { x: 150, y: 100 };
          act();
        });

        it('shape top stays the same', function () {
          expect(scope.shapes[0].model.top).toEqual(100);
        });

        it('shape left stays the same', function () {
          expect(scope.shapes[0].model.left).toEqual(100);
        });

        it('shape midpointX stays the same', function () {
          expect(scope.shapes[0].midPointX).toEqual(50);
        });

        it('shape midpointY stays the same', function () {
          expect(scope.shapes[0].midPointY).toEqual(50);
        });

        it('shape rotates box 90 degrees', function () {
          expect(scope.shapes[0].model.rotation).toEqual(90);
        });
      });
      describe('straight down', function () {
        beforeEach(function () {
          move = { x: -15, y: 200 };
          act();
        });
        it('rotates box 180 degrees', function () {
          expect(scope.shapes[0].model.rotation).toEqual(-180);
        });
      });
    });

    describe('with rotation 45 degrees', function () {
      beforeEach(function () {
        scope.shapes[0].model.rotation = 45;
        scope.$digest();
      });

      describe('se corner', function () {
        beforeEach(function () {
          corner = selectionBoxGroup.find('#cornerSE');
        });
        describe('down', function () {
          beforeEach(function () {
            move = { x: 0, y: 10 };
            act();
          });

          it('increases outline height and width by 5', function () {
            expect(selectionBoxLine.attr('d')).toEqual('M0,0L107.0710678100586,0L107.0710678100586,107.0710678100586L0,107.0710678100586z');
          });

          it('shape top goes up a little', function () {
            expect(scope.shapes[0].model.top).toEqual(101.05025482177734);
          });

          it('shape left goes down a little', function () {
            expect(scope.shapes[0].model.left).toEqual(97.46446228027344);
          });

          it('increases shape width', function () {
            expect(scope.shapes[0].width).toEqual(107.0710678100586);
          });

          it('increases shape height', function () {
            expect(scope.shapes[0].height).toEqual(107.0710678100586);
          });

          it('increases shape midpointX including border width', function () {
            expect(scope.shapes[0].midPointX).toEqual(52.5355339050293);
          });

          it('increases shape midpointY including border width', function () {
            expect(scope.shapes[0].midPointY).toEqual(52.5355339050293);
          });

        });
      });

    });

    describe('when resizing heart', function () {
      beforeEach(function () {
        scope.shapes[0].model.path = 'M190.95184190571857,18.67034584574202c-22.323836384105082,-25.959966259055825 -59.94907374597721,-24.70023237340574 -83.60038330843584,2.7667085108788574L103.48050782485348,25.934428571291733l-3.870951376425747,-4.497373337497029c-23.651309562458632,-27.466939656241248 -61.27654692433076,-28.726676348847562 -83.60038330843584,-2.7667085108788574c-22.333969029440297,25.936421510213755 -21.2598313123552,69.65041398214339 2.381344245776086,97.11735083142841l85.07985583076164,98.8480189913071l85.07985583076164,-98.8480189913071C212.20154057273854,88.32075982788542 213.28581576713086,44.60676174204332 190.95184190571857,18.67034584574202z',

          scope.$digest();
      });

      describe('nw corner', function () {
        beforeEach(function () {
          corner = selectionBoxGroup.find('#cornerNW');
        });
        describe('down and right', function () {
          beforeEach(function () {
            move = { x: 10, y: 10 };
            act();
          });

          it('decreases shape height and width by 10', function () {
            expect(scope.shapes[0].model.path).toEqual('M171.467,16.765c-20.046,-23.311 -53.832,-22.18 -75.07,2.484L92.921,23.288l-3.476,-4.038c-21.238,-24.664 -55.024,-25.795 -75.07,-2.484c-20.055,23.29 -19.09,62.543 2.138,87.207l76.398,88.761l76.398,-88.761C190.548,79.308 191.522,40.055 171.467,16.765z');
          });
        });
        describe('up and left', function () {
          beforeEach(function () {
            move = { x: -10, y: -10 };
            act();
          });

          it('increases shape height and width by 10', function () {
            expect(scope.shapes[0].model.path).toEqual('M210.437,20.575c-24.602,-28.609 -66.066,-27.221 -92.131,3.049L114.04,28.581l-4.266,-4.956c-26.065,-30.27 -67.529,-31.658 -92.131,-3.049c-24.613,28.583 -23.429,76.758 2.624,107.027l93.761,108.935l93.761,-108.935C233.855,97.333 235.05,49.158 210.437,20.575z');
          });
        });
      });

      describe('ne corner', function () {
        beforeEach(function () {
          corner = selectionBoxGroup.find('#cornerNE');
        });
        describe('down and right', function () {
          beforeEach(function () {
            move = { x: 10, y: 10 };
            act();
          });

          it('decreases shape height and increases width by 10', function () {
            expect(scope.shapes[0].model.path).toEqual('M210.437,16.765c-24.602,-23.311 -66.066,-22.18 -92.131,2.484L114.04,23.288l-4.266,-4.038c-26.065,-24.664 -67.529,-25.795 -92.131,-2.484c-24.613,23.29 -23.429,62.543 2.624,87.207l93.761,88.761l93.761,-88.761C233.855,79.308 235.05,40.055 210.437,16.765z');
          });

        });
        describe('up and left', function () {
          beforeEach(function () {
            move = { x: -10, y: -10 };
            act();
          });

          it('increases height and decreases width by 10', function () {
            expect(scope.shapes[0].model.path).toEqual('M171.467,20.575c-20.046,-28.609 -53.832,-27.221 -75.07,3.049L92.921,28.581l-3.476,-4.956c-21.238,-30.27 -55.024,-31.658 -75.07,-3.049c-20.055,28.583 -19.09,76.758 2.138,107.027l76.398,108.935l76.398,-108.935C190.548,97.333 191.522,49.158 171.467,20.575z');
          });
        });
      });

      describe('se corner', function () {
        beforeEach(function () {
          corner = selectionBoxGroup.find('#cornerSE');
        });
        describe('down and right', function () {
          beforeEach(function () {
            move = { x: 10, y: 10 };
            act();
          });

          it('increases shape height and width by 10', function () {
            expect(scope.shapes[0].model.path).toEqual('M210.437,20.575c-24.602,-28.609 -66.066,-27.221 -92.131,3.049L114.04,28.581l-4.266,-4.956c-26.065,-30.27 -67.529,-31.658 -92.131,-3.049c-24.613,28.583 -23.429,76.758 2.624,107.027l93.761,108.935l93.761,-108.935C233.855,97.333 235.05,49.158 210.437,20.575z');
          });

        });
        describe('up and left', function () {
          beforeEach(function () {
            move = { x: -10, y: -10 };
            act();
          });

          it('decreases shape height and width by 10', function () {
            expect(scope.shapes[0].model.path).toEqual('M171.467,16.765c-20.046,-23.311 -53.832,-22.18 -75.07,2.484L92.921,23.288l-3.476,-4.038c-21.238,-24.664 -55.024,-25.795 -75.07,-2.484c-20.055,23.29 -19.09,62.543 2.138,87.207l76.398,88.761l76.398,-88.761C190.548,79.308 191.522,40.055 171.467,16.765z');
          });
        });
      });

      describe('sw corner', function () {
        beforeEach(function () {
          corner = selectionBoxGroup.find('#cornerSW');
        });
        describe('down and right', function () {
          beforeEach(function () {
            move = { x: 10, y: 10 };
            act();
          });

          it('increases shape height and decreases width by 10', function () {
            expect(scope.shapes[0].model.path).toEqual('M171.467,20.575c-20.046,-28.609 -53.832,-27.221 -75.07,3.049L92.921,28.581l-3.476,-4.956c-21.238,-30.27 -55.024,-31.658 -75.07,-3.049c-20.055,28.583 -19.09,76.758 2.138,107.027l76.398,108.935l76.398,-108.935C190.548,97.333 191.522,49.158 171.467,20.575z');
          });
        });
        describe('up and left', function () {
          beforeEach(function () {
            move = { x: -10, y: -10 };
            act();
          });

          it('decreases shape height and increases width by 10', function () {
            expect(scope.shapes[0].model.path).toEqual('M210.437,16.765c-24.602,-23.311 -66.066,-22.18 -92.131,2.484L114.04,23.288l-4.266,-4.038c-26.065,-24.664 -67.529,-25.795 -92.131,-2.484c-24.613,23.29 -23.429,62.543 2.624,87.207l93.761,88.761l93.761,-88.761C233.855,79.308 235.05,40.055 210.437,16.765z');
          });
        });
      });
    });
  });
});