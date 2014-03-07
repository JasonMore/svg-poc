var assert = require('assert'),
  expect = require('expect.js'),
  sinon = require('sinon');

xdescribe('renderTemplate.js >', function() {
  var sandbox, renderTemplate, uuid, webdriver, req, res;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();

    res = sandbox.stub({
      send: fn,
      download: fn
    });

    uuid = require('node-uuid');
    sandbox.stub(uuid,'v4').returns('foo-guid-123');

    webdriver = require('selenium-webdriver');
    sandbox.stub(webdriver);

    renderTemplate = require('./renderTemplate');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('loads', function() {
    expect(renderTemplate).to.be.ok();
  });

  describe('create template >', function() {
    beforeEach(function() {

    });

    describe('create template get >', function() {
      beforeEach(function() {
        req = {
          params: { templateId: 'abc123' },
          query: { dataSetId: 'def456'}
        };

        // act
        renderTemplate.createTemplateGet(req, res);
      });

      it('on success downloaded template', function() {
        expect(res.download.called).to.be(1)
      });
    });

    describe('create template post >', function() {

    });
  });


  describe('render template with webdriver >', function() {

  });

  describe('get template temp data >', function() {

  });

  describe('render template >', function() {

  });


});

function fn() {
};