(function () {
  angular.module('svgAbstraction.services').service('dataMergeService', function (dotNotation) {
    var dictionary = {
      "text": "text",
      "background": "backgroundColor",
      "Student_Picture": "image.url"
    };

    this.getMergedShapesWithData = function (shapes, data, vocabulary) {
      var mergedData = angular.copy(shapes);
      // for each shape
      //  for each fieldBinding
      //    check conditionals
      //    if conditional met, replace value
      //

      _(mergedData).each(function (shape) {
        var fields = _.keys(shape.fieldBindings);

        _(fields).each(function (field) {
          var binding = shape.fieldBindings[field];

          // binding ranges take precidence
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

        _(shape.fieldBindings).keys(function (binding) {
//          console.log(binding);
        });
      });

      return mergedData;
    }
  });
}());