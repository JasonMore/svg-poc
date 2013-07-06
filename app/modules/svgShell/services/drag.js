(function () {
  angular.module('svgShell.services').service('dragService', function (translationService) {

    this.makeDraggable = function(shape) {
      $(shape).draggable(dragObj);
    };

    var dragObj = {
      start: function () {
        var matrix = this.getScreenCTM().inverse();

        var pt = this.ownerSVGElement.createSVGPoint();
        pt.x = event.pageX;
        pt.y = event.pageY;
        pt = pt.matrixTransform(matrix);

        this.setAttribute('orig', JSON.stringify({x: pt.x, y: pt.y}));
      },
      drag: function (event, ui) {
        var matrix = this.getScreenCTM().inverse();
        var orig = JSON.parse(this.getAttribute('orig'));

        // convert screen to element coordinates
        var pt = this.ownerSVGElement.createSVGPoint();
        pt.x = event.pageX;
        pt.y = event.pageY;
        pt = pt.matrixTransform(matrix);

        var deltax = pt.x - orig.x;
        var deltay = pt.y - orig.y;

        var pt2 = this.ownerSVGElement.createSVGPoint();
        pt2.x = deltax;
        pt2.y = deltay;
        pt2 = pt2.matrixTransform(this.getCTM());

        var pt3 = this.ownerSVGElement.createSVGPoint();
        pt3.x = 0;
        pt3.y = 0;
        pt3 = pt3.matrixTransform(this.getCTM());

        deltax = pt2.x - pt3.x;
        deltay = pt2.y - pt3.y;

        // //console.log('drag this', pt3, {x: pt2.x, y: pt2.y});
        // set the translate
        // svg.change(this, {cx: pt.x, cy: pt.y});

        translationService.adjustTranslate(this, deltax, deltay, true);

        var groupToModify = $(this).data('groupToModify');
        translationService.adjustTranslate(groupToModify, deltax, deltay, true);
      },
      stop: function () {

      }
    };



  });
})();