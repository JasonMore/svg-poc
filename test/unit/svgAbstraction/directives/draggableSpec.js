xdescribe('draggableSpec.js', function () {

  var element,
    scope,
    vmService,
    act,
    canDrag = true;
  ;

  beforeEach(module('preloadAllHtmlTemplates'));
  beforeEach(module('liveResource'));
  beforeEach(module('svg-poc'));

  beforeEach(inject(function ($rootScope, $compile, shapeViewModelService) {
    vmService = shapeViewModelService;
    element = angular.element('<ng-include src="\'modules/svgAbstraction/svgCanvas.html\'"></ng-include>');
    scope = $rootScope;
    $compile(element)(scope);
  }));

  describe('when shape is draggable', function () {
    beforeEach(function () {
      scope.canDragShape = function (shape) {
        return canDrag;
      }

      var model = {
        top: 0,
        left: 0,
        path: 'M0,0L100,0L100,100L0,100z',
        "width": 216,
        "height": 190,
        "rotation": 0,
        "backgroundColor": "gray",
        "borderColor": "black",
        "borderWidth": 2,
        "image": {
          "url": null,
          "top": 0,
          "left": 0,
          "width": 0,
          "height": 0,
          "rotation": 0
        },
        "id": "abc123",
        "order": 2,
        "text": "",
        "font": "Verdana",
        "fontSize": "12.0",
        "fontColor": "black",
        "wrapTextAround": true
      };

      act = function() {
        scope.shapes = {
          "abc123": vmService.create(function () {
            return 0;
          }, function () {
            return model;
          })};

        scope.computedShapes = function() { return scope.shapes;}

        scope.$digest();

        var mouseDown = $.Event('mousedown', {
          which: 1,
          pageX: 50,
          pageY: 50
        });

        var mousemove = $.Event("mousemove.draggable", {
          pageX: 60,
          pageY: 60
        });

        var mouseup = $.Event("mouseup.draggable", {
          pageX: 60,
          pageY: 60
        });


        var parentGroup = element.find('g[ng-svg-shape]');
        parentGroup.trigger(mouseDown);

        $(document).trigger(mousemove);
        $(document).trigger(mouseup);
        $(document).trigger($.Event("mouseup"));
      }


    });

    it('moves shape top', function () {
      act();
      expect(scope.shapes['abc123'].model.top).toEqual(10);
    });

    it('moves shape left', function () {
      act();
      expect(scope.shapes['abc123'].model.left).toEqual(10);
    });

    describe('draggable disabled', function () {
      beforeEach(function () {
        canDrag = false;
      });

      it('doesnt move shape top', function () {
        act();
        expect(scope.shapes['abc123'].model.top).toEqual(0);
      });

      it('doesnt move shape left', function () {
        act();
        expect(scope.shapes['abc123'].model.left).toEqual(0);
      });
    })
  });
});