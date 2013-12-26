(function () {
  angular.module('svgAbstraction.services').service('dataMergeService', function (dotNotation) {
            var dictionary = {
          "text": "text",
          "Student_Picture": "image.url"
        };

    this.getMergedShapesWithData = function(shapes, data, vocabulary){
      var mergedData = angular.copy(shapes);
      // for each shape
      //  for each fieldBinding
      //    check conditionals
      //    if conditional met, replace value
      //

      _(mergedData).each(function(shape) {
        var fields = _.keys(shape.fieldBindings);

        _(fields).each(function(field){
          var binding = shape.fieldBindings[field];


          dotNotation.getSet(shape, dictionary[field], data[binding.boundTo]);
        });

        _(shape.fieldBindings).keys(function(binding){
//          console.log(binding);
        });
      });

      return mergedData;
    }
  });
}());