(function() {
  angular.module('svgAbstraction').factory('collectionArraySync', function($rootScope) {

    return {
      create: function create(collection, liveResourceScope) {
        window.debugCollection = collection;
        var mappedArray = [];

        // convert object collection to array
        $rootScope.$watch(function() {
          return collection;
        }, convertObjectCollectionToArray, true);

        function convertObjectCollectionToArray() {
          var updatedValues = _(collection)
            .sortBy('order')
            .values()
            .value();

          // empty the array
          mappedArray.length = 0;

          // add the new values onto the existing array
          _.extend(mappedArray, updatedValues);
        }

        // update order of object when its position changes in mapped array
        $rootScope.$watchCollection(function() {
          return mappedArray;
        }, function(newArray, oldArray) {
          // standard for loop since order is important
          for (var i = 0; i < mappedArray.length; i++) {
            mappedArray[i].order = i;
          }

          // sorry you can't add/remove items from the array,
          // so I'm going to recreate it for you :-(
          if(newArray.length !== oldArray){
            convertObjectCollectionToArray();
          }
        });

        return mappedArray;
      }
    };
  });
}());