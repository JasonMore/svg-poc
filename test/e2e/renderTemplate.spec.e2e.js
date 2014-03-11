var assert = require('assert'),
  expect = require('expect.js'),
  request = require('request'),
  racer = require('racer')
  ;

describe('rendering template >', function() {
  this.timeout(10000); // 10 seconds

  var racerModel, templateType, template;

  before(function(done) {
    request.get('http://localhost:3000/racerInit', function(error, response, body) {
      var data = JSON.parse(body);
      racer.init(data);
    });

    racer.ready(function(model) {
      racerModel = model;
      templateType = createTemplateType();
      template = createTemplate(templateType.id);
      done();
    });
  });

  after(function(done) {
    deleteTemplateAndType();
    done();
  });

  it('get request downloads pdf', function(done) {

    var url = 'http://localhost:3000/createTemplate/' + template.id + '?dataSetId=3ff12b9f-6620-4450-84fd-7cfe86905975';
    request.get(url, function(error, response, body) {

      expect(error).to.be(null);

      // check response is pdf
      var firstLine = body.split('\n')[0];
      expect(firstLine).to.equal('%PDF-1.4');

      done();
    });
  });

  it('post request downloads pdf', function(done) {
    var url = 'http://localhost:3000/createTemplate/' + template.id;
    var templateData = {
      "First_Name": "Marcus",
      "Last_Name": "Jordan",
      "TeacherNbr": "John Madden",
      "Grade": "10",
      "Portrait": "img/CO/Flash5.jpg",
      "School_Name": "Sunnyside High",
      "id": "3ff12b9f-6620-4450-84fd-7cfe86905975"
    };
    var options = {url: url, form: {templateTempData: templateData}};

    request.post(options, function(error, response, body) {

      expect(error).to.be(null);

      // check response is pdf
      var firstLine = body.split('\n')[0];
      expect(firstLine).to.equal('%PDF-1.4');

      done();
    });
  });

  function createTemplateType() {
    var templateType = {
      name: 'Id Card',
      requiredFields: ["Student_Name", "Student_Picture"],
      optionFields: ["Student_Grade", "Student_Teacher", "School_Name"],
      mockData: {
        "Student_Name": "Johnny Appleseed",
        "Student_Picture": "img/CO/Flash1.jpg",
        "Student_Grade": "11",
        "Student_Teacher": "Mr. Krum",
        "School_Name": "Sunnyside Elementary"
      }
    };

    racerModel.add('templateType', templateType);
    return templateType;
  }

  function createTemplate(templateTypeId) {
    var template = {
      "width": 1500,
      "height": 1500,
      "name": "asdf",
      "templateType": "cd48a36b-b374-4517-8179-196274b6b3c1",
      "created": "2014-01-20T20:22:33.179Z",
      "id": "8cadc1aa-9cea-400a-9348-3090b16b66c1",
      "shapes": {
        "07fd7304-2911-4fe2-99d2-1ea8d39c2f3a": {
          "top": 117.5,
          "left": 146,
          "width": 334,
          "height": 342.5,
          "rotation": 0,
          "path": "M0,0L328.235,0L328.235,336.451L0,336.451z",
          "backgroundColor": "rgba(204,53,53,1)",
          "borderColor": "black",
          "borderWidth": "11",
          "image": {
            "url": null,
            "top": 0,
            "left": 0,
            "width": 0,
            "height": 0,
            "rotation": 0
          },
          "order": 0,
          "id": "07fd7304-2911-4fe2-99d2-1ea8d39c2f3a",
          "text": "asdf",
          "font": "Verdana",
          "fontSize": "60.0",
          "fontColor": "black",
          "wrapTextAround": true,
          "transparency": "1",
          "shadow": {
            "enabled": false,
            "offsetX": 20,
            "offsetY": "100",
            "density": "10"
          },
          "bevel": {
            "enabled": false,
            "density": "5.6"
          },
          "blur": {
            "enabled": false,
            "density": "11.4"
          },
          "fieldBindings": {
            "background": {
              "boundTo": "Grade",
              "bindings": {
                "64a17007-f213-4119-b4a4-3e4ce1168151": {
                  "type": "eq",
                  "fieldValue": "13",
                  "overrideValue": "rgba(0,255,25,1)",
                  "id": "64a17007-f213-4119-b4a4-3e4ce1168151",
                  "order": 2
                },
                "f0317cd5-0046-4d44-a447-b0192568b3bb": {
                  "type": "eq",
                  "fieldValue": "11",
                  "overrideValue": "rgba(0,87,255,1)",
                  "id": "f0317cd5-0046-4d44-a447-b0192568b3bb",
                  "order": 0
                },
                "40c6b595-2d30-465d-aee4-3a208121df97": {
                  "type": "eq",
                  "fieldValue": "12",
                  "overrideValue": "rgba(255,0,0,1)",
                  "id": "40c6b595-2d30-465d-aee4-3a208121df97",
                  "order": 1
                },
                "c08b27ee-7e94-4990-ac47-7a87eca9dbb4": {
                  "type": "eq",
                  "fieldValue": "14",
                  "overrideValue": "",
                  "id": "c08b27ee-7e94-4990-ac47-7a87eca9dbb4",
                  "order": 3
                }
              }
            },
            "borderColor": {
              "boundTo": "",
              "bindings": {}
            },
            "text": {
              "boundTo": "First_Name"
            }
          }
        }
      }
    };

    racerModel.add('template', template);
    return template;
  }


  function deleteTemplateAndType() {
    racerModel.del('templateType.' + templateType.id);
    racerModel.del('template.' + template.id);
  }
});