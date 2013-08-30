(function () {
  angular.module('svgAbstraction.services').service('shapeViewModelService', function (pathService) {
    this.create = function create(shape) {
      var selectionBox,
        width = 0,
        height = 0;

      // add image properties if they don't exist
      _.defaults(shape, {
        "image": {
          "url": null,
          "top": 0,
          "left": 0,
          "width": 0,
          "height": 0,
          "rotation": 0
        }
      });

      return {
        model: shape,
        showPreviewImage: false,

        selectionBox: function () {
          if (!selectionBox) {
            selectionBox = pathService.getSelectionBox(this.svgElementPath);
          }

          if(!selectionBox){
            return {
              width: 0,
              height: 0
            }
          }

          return selectionBox;
        },

        borderOffset: function () {
          return this.model.borderWidth / 2;
        },

        height: function (newValue) {
          if(newValue){
            height = newValue;
          }

          if(!height && this.selectionBox().height){
            height = this.selectionBox().height - this.borderOffset();
          }

          return height + this.borderOffset();
        },

        width: function (newValue) {
          if(newValue){
            width = newValue;
          }

          if(!width && this.selectionBox().width){
            width = this.selectionBox().width - this.borderOffset();
          }

          return width + this.borderOffset();
        },

        midPointX: function () {
          return (this.width() - this.borderOffset()) / 2;
        },

        midPointY: function () {
          return (this.height() - this.borderOffset()) / 2;
        },

        hasImage: function() {
          return this.model.image.url ? true : false;
        },

        imageLeft: function(value) {
          return this.hasImage() ? getSetValue(this.model.image.left, value) : 0;
        },

        imageTop: function(value) {
          return this.hasImage() ? getSetValue(this.model.image.top, value) : 0;
        },

        imageWidth: function(value) {
          return this.hasImage() ? getSetValue(this.model.image.width, value) : 0;
        },

        imageHeight: function(value) {
          return this.hasImage() ? getSetValue(this.model.image.height, value) : 0;
        },

        makeUrlRef: function(key) {
          return this.model.id + '_' + key;
        },

        urlRef: function(key){
          return "#" + this.model.id + "_" + key;
        }
      };

      function getSetValue(property, value) {
        if(value){
          property = value
        }

        return property;
      }
    };
  });
})();