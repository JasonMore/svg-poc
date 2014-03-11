var assert = require('assert'),
  expect = require('expect.js'),
  request = require('request'),
  racer = require('racer'),
  serverRacer = require('../../server/setup/racer')
//  uuid = require('uuid')
  ;
console.log(serverRacer);
describe('rendering template >', function() {
  this.timeout(10000); // 10 seconds

  var racerModel, templateType, template;

  before(function(done) {
    request.get('http://localhost:3000/racerInit', function(error, response, body){
      racer.init(response.toJSON());
    });

//    var racerModel = store.createModel({fetchOnly: true});

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

    var url = 'http://localhost:3000/createTemplate/8cadc1aa-9cea-400a-9348-3090b16b66c1?dataSetId=3ff12b9f-6620-4450-84fd-7cfe86905975';
    request.get(url, function(error, response, body) {

      expect(error).to.be(null);

      // check response is pdf
      var firstLine = body.split('\n')[0];
      expect(firstLine).to.equal('%PDF-1.4');

      done();
    });
  });

  it('post request downloads pdf', function() {
    var url = 'http://localhost:3000/createTemplate/8cadc1aa-9cea-400a-9348-3090b16b66c1';
    request.get(url, function(error, response, body) {

      expect(error).to.be(null);

      // check response is pdf
      var firstLine = body.split('\n')[0];
      expect(firstLine).to.equal('%PDF-1.4');

      done();
    });
  });

  function createTemplate(templateTypeId) {
    console.log(racerStore);
  }

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
    }
  }

  function deleteTemplateAndType() {

  }
});