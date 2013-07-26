(function () {
  angular.module('svgShell.services').service('translationService', function () {
    this.adjustTranslate = function(elt, x, y, isRelative) {

      if (elt.transform.baseVal.numberOfItems > 0) {
        // make sure transform 1 is a translate transform
        var trans = elt.transform.baseVal.getItem(0);
        if (trans.type == 2) {
          if (isRelative) {

            var origX = trans.matrix.e;
            var origY = trans.matrix.f;

            //  //console.log('AdjustTranslate', x, y);
            trans.setTranslate(origX + x, origY + y);
            console.log(origX + x, origY + y);

          } else {
            trans.setTranslate(x, y);
          }
        }
      }
    }

  });
})();