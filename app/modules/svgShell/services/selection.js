(function () {
  angular.module('svgShell.services').service('selectionService', function () {
    var self = this;

    // the box that surrounds a selected item
    self.selectionBox;

    self.clearSelection = function () {
      if (self.start) {
        return;
      }

      if (!self.selectionBox) {
        return;
      }

      self.svg.remove(self.selectionBox);
      self.selectionBox = null;
      self.resetSelectedShape();
    };

    self.createSelectionBox = function (svg, group, transformStr) {
      var id = 'what is this used for?';

      var shape = $(group).find('.shape')[0];
      var transformStr = group.getAttribute('transform');
      var boundingBox = shape.getBBox();

      var selectionPath = svg.createPath()
        .move(0, 0)
        .line(boundingBox.width, 0)
        .line(boundingBox.width, boundingBox.height)
        .line(0, boundingBox.height)
        .close();

      var selectionGroup = svg.group({
        id: 'outlineShape',
        refId: id,
        origRect: JSON.stringify(boundingBox),
        rect1: JSON.stringify(boundingBox),
        transform: transformStr
      });

      svg.path(selectionGroup, selectionPath, {
        id: 'outlinePath',
        fill: 'none',
//        fill: 'white',
        //fillOpacity: '0.3',
        'stroke-dasharray': '5,5',
        stroke: '#D90000',
        strokeWidth: 2,
        class: 'draggable'
      });

      var halfWidth = boundingBox.width / 2;

      var defaultCircleSettings = {
        class_: 'resizable',
        fill: '#D90000'
      };

      svg.circle(selectionGroup, 0, 0, 5, _.extend(defaultCircleSettings, {
        id: 'cornerNW',
        transform: 'translate(0,0)'
      }));

      svg.circle(selectionGroup, 0, 0, 5, _.extend(defaultCircleSettings, {
        id: 'cornerNE',
        transform: 'translate(' + boundingBox.width + ',0)'
      }));

      svg.circle(selectionGroup, 0, 0, 5, _.extend(defaultCircleSettings, {
        id: 'cornerSE',
        transform: 'translate(' + boundingBox.width + ',' + boundingBox.height + ')'
      }));

      svg.circle(selectionGroup, 0, 0, 5, _.extend(defaultCircleSettings, {
        id: 'cornerSW',
        transform: 'translate(0,' + boundingBox.height + ')'
      }));

      svg.line(selectionGroup, 0, 0, 0, -20, {
        id: 'rotatorLine',
        stroke: '#D90000',
        strokeWidth: 3,
        transform: 'translate(' + halfWidth + ',0)'
      });

      svg.circle(selectionGroup, 0, 0, 5, {
        id: 'rotator',
        class_: 'resizable',
        stroke: '#D90000',
        fill: '#FFFFFF',
        strokeWidth: 1,
        transform: 'translate(' + halfWidth + ',-20)'
      });

      return selectionGroup;
    }
  });
})();