describe('dataMergeService.js > ', function () {
  beforeEach(module('svg-poc'));
  var data, vocabulary,
    shapes = {
      "abc123": {
        "top": 10,
        "left": 10,
        "width": 300,
        "height": 300,
        "rotation": 0,
        "path": "M0,0L300,0L300,300L0,300z",
        "backgroundColor": "rgba(53,99,204,1)",
        "borderColor": "black",
        "borderWidth": 2,
        "image": {
          "url": null,
          "top": 0,
          "left": 0,
          "width": 0,
          "height": 0,
          "rotation": 0
        },
        "order": 0,
        "id": "abc123",
        "text": "",
        "font": "Verdana",
        "fontSize": "12.0",
        "fontColor": "black",
        "wrapTextAround": true,
        "transparency": 1,
        "shadow": {
          "enabled": false,
          "offsetX": 20,
          "offsetY": 20,
          "density": 10
        },
        "fieldBindings": {}
      }
    };

  var shape = shapes['abc123'];

  describe('shapesWithData >', function () {
    var act, mergedShapes;

    beforeEach(inject(function (dataMergeService) {
      act = function () {
        mergedShapes = dataMergeService.shapesWithData(shapes, data, vocabulary);
      };
    }));

    describe('when no data to merge with >', function () {
      beforeEach(function() {
        act();
      });

      it('returns a copy of the shapes', function () {
        expect(mergedShapes).toEqual(shapes);
      });

      it('should not return the same object', function () {
        expect(mergedShapes).toNotBe(shapes);
      })
    });

    describe('when merge data >', function() {
      beforeEach(function() {
        data = {
          "First_Name": "Marcus",
          "Last_Name": "Jordan",
          "Teacher_Name": "John Madden",
          "Grade": "11",
          "Portrait": "img/CO/Flash5.jpg",
          "School_Name": "Sunnyside High"
        };

        vocabulary = {
          'a1': {field: 'First_Name', type: 'alpha'},
          'a2': {field: 'Portrait', type: 'imageUrl'}
        };

      });

      describe('when has text field binding >', function () {
        beforeEach(function () {
          shape.fieldBindings.text = {
            boundTo: 'First_Name'
          };

          act();
        });

        it('should replace shape text with data text', function () {
          expect(mergedShapes['abc123'].text).toEqual("Marcus");
        })
      });

      describe('when background has field data binding >', function () {
        beforeEach(function () {
          shape.fieldBindings.background = {
            "boundTo": "Grade",
            "bindings": {
              "2c37432c-50c4-4b11-a777-e3897dd9b1aa": {
                "type": "eq",
                "fieldValue": "11",
                "overrideValue": "rgba(0,80,255,1)",
                "id": "2c37432c-50c4-4b11-a777-e3897dd9b1aa"
              }
            }
          };

          act();
        });

        it('should replace shape background with rgba value', function () {
          expect(mergedShapes['abc123'].backgroundColor).toEqual("rgba(0,80,255,1)");
        });

        it('property without field binding should be original', function() {
          expect(mergedShapes['abc123'].borderColor).toEqual('black');

        });
      });

      describe('when image has binding >', function () {
        beforeEach(function () {
          shape.fieldBindings.image = {
            "boundTo": "Portrait",
            "bindings": {}
          };

          act();
        });

        it('should replace shape image url', function () {
          expect(mergedShapes['abc123'].image.url).toEqual("img/CO/Flash5.jpg");
        });
      })
    });
  });
});