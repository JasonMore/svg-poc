(function() {
  angular.module('svgAbstraction.services').factory('collectionArraySync', function($rootScope) {

    return new function collectionArraySync() {

      this.create = function create(collection, liveResourceScope) {
        window.debugCollection = collection;
        var mappedArray = [];

        // convert object collection to array
        $rootScope.$watch(function() {
          return collection;
        }, function() {
          var updatedValues = _(collection)
            .sortBy('order')
            .values()
            .value();

          // empty the array
          mappedArray.length = 0;

          // add the new values onto the existing array
          _.extend(mappedArray, updatedValues);
        }, true);

        // update order of object when its position changes in mapped array
        $rootScope.$watchCollection(function() {
          return mappedArray;
        }, function() {
          // standard for loop since order is important
          for (var i = 0; i < mappedArray.length; i++) {
            mappedArray[i].order = i;
          }
        });

        return mappedArray;
      }
    };
  });
}());