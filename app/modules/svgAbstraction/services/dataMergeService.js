(function () {
  angular.module('svg-poc').service('dataMergeService', function (dotNotation) {
    var modelTranslate = {
      "text": "text",
      "background": "backgroundColor",
      "image": "image.url",
      "fontColor": "fontColor"
    };

    this.shapesWithData = function (shapes, data) {
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
                dotNotation.getSet(shape, modelTranslate[field], dataBinding.overrideValue);
              }
            });
          } else {
            dotNotation.getSet(shape, modelTranslate[field], data[binding.boundTo]);
          }
        });
      });

      return mergedData;
    }
  });
}());