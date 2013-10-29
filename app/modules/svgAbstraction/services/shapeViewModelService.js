(function () {
  angular.module('svgAbstraction.services').service('shapeViewModelService', function (pathService) {
    this.create = function create(nextOrderByNumber, getModelFn) {
      var selectionBox;

      // add image properties if they don't exist

      function shapeViewModel(getModelFn){
//        this.model = model;
        this.getModel = getModelFn;
        this.showPreviewImage = false;
        this.isEditingText = false;

        _.defaults(this.model, {
          order: nextOrderByNumber,
          text: '',
          font: 'Verdana',
          fontSize: '12.0',
          fontColor: 'black',
          wrapTextAround: true,
          "image": {
            "url": null,
            "top": 0,
            "left": 0,
            "width": 0,
            "height": 0,
            "rotation": 0
          }
        });
      }

      Object.defineProperty(shapeViewModel.prototype, "model", {
        get : function(){ return this.getModel(); },
        //set : function(newValue){ bValue = newValue; },
        enumerable : true,
        configurable : true
      });

      _.extend(shapeViewModel.prototype, {

        id: function () {
          return this.model.id;
        },

        selectionBox: function () {
          if (!selectionBox) {
            selectionBox = pathService.getSelectionBox(this.svgElementPath);
          }

          if (!selectionBox) {
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

        left: function () {
          return this.model.left - this.borderOffset();
        },

        top: function () {
          return this.model.top - this.borderOffset();
        },

        height: function (newValue) {
          if (newValue) {
            this.model.height = newValue;
          }

          if (!this.model.height && this.selectionBox().height) {
            this.model.height = this.selectionBox().height - this.borderOffset();
          }

          return this.model.height + this.borderOffset();
        },

        width: function (newValue) {
          if (newValue) {
            this.model.width = newValue;
          }

          if (!this.model.width && this.selectionBox().width) {
            this.model.width = this.selectionBox().width - this.borderOffset();
          }

          return this.model.width + this.borderOffset();
        },

        midPointX: function () {
          return (this.width() - this.borderOffset()) / 2;
        },

        midPointY: function () {
          return (this.height() - this.borderOffset()) / 2;
        },

        hasImage: function () {
          return this.model.image.url ? true : false;
        },

        imageLeft: function () {
          return this.hasImage() ? this.model.image.left : 0;
        },

        imageTop: function () {
          return this.hasImage() ? this.model.image.top : 0;
        },

        imageWidth: function () {
          return this.hasImage() ? this.model.image.width : 0;
        },

        imageHeight: function () {
          return this.hasImage() ? this.model.image.height : 0;
        },

        imageRotation: function() {
          return this.hasImage() ? this.model.image.rotation + this.model.rotation : 0;
        },

        imageMidPointX: function () {
          return this.hasImage() ? this.imageWidth() / 2 : 0;
        },

        imageMidPointY: function () {
          return this.hasImage() ? this.imageHeight() / 2 : 0;
        },

        imageOutlineLeft: function(){
          return this.hasImage() ? this.imageLeft() + this.left() + this.borderOffset(): 0;
        },

        imageOutlineTop: function(){
          return this.hasImage() ? this.imageTop() + this.top() + this.borderOffset(): 0;
        },

        imageOutlineRotation: function(){
          return this.hasImage() ? this.model.image.rotation + this.model.rotation: 0;
        },

        makeUrlRef: function (key) {
          return this.model.id + '_' + key;
        },

        urlRef: function (key) {
          return "#" + this.model.id + "_" + key;
        }
      });

      return new shapeViewModel(getModelFn);
    };
  });
})();