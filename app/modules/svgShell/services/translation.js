(function () {
  angular.module('svgShell.services').service('translationService', function () {
    this.adjustTranslate = function(elt, x, y, rel) {

      if (elt.transform.baseVal.numberOfItems > 0) {
        // make sure transform 1 is a translate transform
        var trans = elt.transform.baseVal.getItem(0);
        if (trans.type == 2) {
          if (rel) {

            var origX = trans.matrix.e;
            var origY = trans.matrix.f;

            //  //console.log('AdjustTranslate', x, y);
            console.log(origX, origY);
            trans.setTranslate(origX + x, origY + y);

          } else {
            trans.setTranslate(x, y);
          }
        }
      }
    }

  });
})();