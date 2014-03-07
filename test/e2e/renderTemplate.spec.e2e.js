var assert = require('assert'),
  expect = require('expect.js'),
  request = require('request');

describe('rendering template >', function() {
  this.timeout(60000); // 60 seconds

  it('get request downloads pdf', function(done) {

    var url = 'http://localhost:3000/createTemplate/8cadc1aa-9cea-400a-9348-3090b16b66c1?dataSetId=3ff12b9f-6620-4450-84fd-7cfe86905975';
    request.get(url, function(error, response, body){

      expect(error).to.be(null);

      // check response is pdf
      var firstLine = body.split('\n')[0];
      expect(firstLine).to.equal('%PDF-1.4');

      done();
    });
  });

  it('post request downloads pdf', function() {
    var url = 'http://localhost:3000/createTemplate/8cadc1aa-9cea-400a-9348-3090b16b66c1';
    request.get(url, function(error, response, body){

      expect(error).to.be(null);

      // check response is pdf
      var firstLine = body.split('\n')[0];
      expect(firstLine).to.equal('%PDF-1.4');

      done();
    });
  });
});