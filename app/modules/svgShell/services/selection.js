(function () {
  angular.module('svgShell.services').service('selectionService', function (surfaceService, resizeService, dragService) {
    var self = this;

    // hooks from external sources
    self.startEditingText;


    // the box that surrounds a selected item
    self.selectionBox;
    self.textBoxDimensions;

    self.clearSelection = function () {
      if (!self.selectionBox) {
        return;
      }

      surfaceService.svg.remove(self.selectionBox);
      self.selectionBox = null;
      self.resetSelectedShape();
    };

    self.createSelectionBox = function (group) {
      var shape = $(group).find('.shape')[0];
      var transformStr = group.getAttribute('transform');
      var boundingBox = shape.getBBox();

      var selectionPath = surfaceService.svg.createPath()
        .move(0, 0)
        .line(boundingBox.width, 0)
        .line(boundingBox.width, boundingBox.height)
        .line(0, boundingBox.height)
        .close();

      var selectionBox = surfaceService.svg.group({
        origRect: JSON.stringify(boundingBox),
        rect1: JSON.stringify(boundingBox),
        transform: transformStr
      });

      surfaceService.svg.path(selectionBox, selectionPath, {
        id: 'outlinePath',
        //fill: 'none',
        fill: 'white',
        fillOpacity: '0.3',
        'stroke-dasharray': '5,5',
        stroke: '#D90000',
        strokeWidth: 2,
        class: 'draggable'
      });

      var halfWidth = boundingBox.width / 2;

      var defaultCircleSettings = {
        class_: 'resizable',
        fill: '#D90000',
        'stroke-width': 1,
        stroke: 'white'
      };

      var cornerNW = surfaceService.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
        id: 'cornerNW',
        transform: 'translate(0,0)'
      }));

      var cornerNE = surfaceService.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
        id: 'cornerNE',
        transform: 'translate(' + boundingBox.width + ',0)'
      }));

      var cornerSE = surfaceService.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
        id: 'cornerSE',
        transform: 'translate(' + boundingBox.width + ',' + boundingBox.height + ')'
      }));

      var cornerSW = surfaceService.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
        id: 'cornerSW',
        transform: 'translate(0,' + boundingBox.height + ')'
      }));

      surfaceService.svg.line(selectionBox, 0, 0, 0, -20, {
        id: 'rotatorLine',
        stroke: '#D90000',
        strokeWidth: 3,
        transform: 'translate(' + halfWidth + ',0)'
      });

      var rotator = surfaceService.svg.circle(selectionBox, 0, 0, 5, _.extend(defaultCircleSettings, {
        id: 'rotator',
        fill: '#FFFFFF',
        stroke: '#D90000',
        strokeWidth: 1,
        transform: 'translate(' + halfWidth + ',-20)'
      }));

      // hack?
      $(selectionBox).data('groupToModify', group);
      $(cornerNW).data('groupToModify', group);
      $(cornerNE).data('groupToModify', group);
      $(cornerSE).data('groupToModify', group);
      $(cornerSW).data('groupToModify', group);
      $(rotator).data('groupToModify', group);

      $(selectionBox).on('dblclick', editText);

      // set public properties for selection for use outside service
      self.selectionBox = selectionBox;
      self.translationOffset = $(group).data('translationOffset');

      resizeService.attachResizeBindings($('.resizable'));
      dragService.makeDraggable(selectionBox);

      return selectionBox;
    }

    function editText() {
      var shapeGroup = $(this).data('groupToModify');
      var boundingBox = shapeGroup.getBBox();
      var screenCtm = shapeGroup.getCTM();

      self.textBoxDimensions = {
        left: screenCtm.e,
        top: screenCtm.f,
        width: boundingBox.width,
        height: boundingBox.height
      };

      self.startEditingText();
    }

    self.hideSelectionBox = function() {
      $(self.selectionBox).hide();
    };

    self.showSelectionBox = function(){
      $(self.selectionBox).show();
    };
  });
})();