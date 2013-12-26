(function () {
  angular.module('svgAbstraction.services').service('dataMergeService', function (dotNotation) {
    var dictionary = {
      "text": "text",
      "background": "backgroundColor",
      "image": "image.url"
    };

    this.getMergedShapesWithData = function (shapes, data) {
      var mergedData = angular.copy(shapes);

      _(mergedData).each(function (shape) {
        var fields = _.keys(shape.fieldBindings);

        _(fields).each(function (field) {
          var binding = shape.fieldBindings[field];

          // binding ranges take precedence
          if (_.size(binding.bindings)) {
            _(binding.bindings).each(function (dataBinding) {

              // only checking for equals binding right now
              if(dataBinding.fieldValue == data[binding.boundTo]){
                dotNotation.getSet(shape, dictionary[field], dataBinding.overrideValue);
              }
            });
          } else {
            dotNotation.getSet(shape, dictionary[field], data[binding.boundTo]);
          }
        });
      });

      return mergedData;
    }
  });
}());