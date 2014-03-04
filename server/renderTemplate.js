var request = require('request'),
  fs = require('fs'),
  webdriver = require('selenium-webdriver'),
  url = require('url'),
  template = require('lodash-node/modern/utilities/template'),
  uuid = require('node-uuid'),
  redisClient = require('./setup/redis').client;
;

/*
 Type: GET
 Url: /createTemplate/:templateID?:dataSetId
 Description: Merges a template and data
 Params:{
 templateId: REQUIRED, The ID of the template you want to render
 dataSetId: REQUIRED, The ID of the student to merge the template with
 }
 Returns: Rendered PDF
 */
function createTemplateGet(req, res) {
  var hashData = {
    renderId: uuid.v4(),
    templateId: req.params.templateId,
    dataSetId: req.query.dataSetId
  };

  var hashTemplate = template('#/renderTemplate/${templateId}?dataSetId=${dataSetId}&renderId=${renderId}', hashData);

  var templateToRender = url.format({
    protocol: 'http',
    hostname: 'localhost', // TODO: replace with env variable
    port: 3000,
    pathname: '/',
    hash: hashTemplate
  });

  var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

  driver.get(templateToRender)
    .then(null, renderError); // catch error

  driver.wait(waitForTitle, 1000000)
    .then(renderSuccess)
    .then(null, renderError);

  driver.quit();

  function waitForTitle() {
    return driver.getTitle().then(function(title) {
      return (title === 'doneRendering' || title === 'failedRendering') ? title : false;
    });
  }

  function renderSuccess(value) {
    console.log(value);
    if (value === 'doneRendering') {
      downloadTemplate();
    } else {
      res.send(500, 'Batik Rendering Error');
    }
  }

  function renderError(error) {
    res.send(500, error);
    driver.quit();
  }

  function downloadTemplate() {
    // uncomment to download file
    res.download(hashData.renderId + '.pdf', 'renderedTemplate.pdf', function(err) {
      fs.unlink(hashData.renderId + '.pdf');
    });
  }
}

/*
 Type: POST
 Url: /createTemplate/:templateID
 Description: Merges a template and data. If a dataSetId is passed in, the templateTempData
 will be ignored
 Params:{
 templateId: The ID of the template you want to render
 }
 POST Data: {
 templateTempData: JSON The data you want to render against the template.
 dataSetId: The ID of the student data you want to merge against.
 }
 Returns: URL where to download rendered PDF
 */
function createTemplatePost(req, res) {
  var hashData = {
    renderId: uuid.v4(),
    templateId: req.params.templateId
  };

  redisClient.set("renderTemplate:data:" + hashData.renderId, req.body.templateTempData);

  var hashTemplate = template('#/renderTemplate/${templateId}?renderId=${renderId}', hashData);

  var templateToRender = url.format({
    protocol: 'http',
    hostname: 'localhost', // TODO: replace with env variable
    port: 3000,
    pathname: '/',
    hash: hashTemplate
  });

  var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

  driver.get(templateToRender)
    .then(null, renderError); // catch error

  driver.wait(waitForTitle, 1000000)
    .then(renderSuccess)
    .then(null, renderError);

  driver.quit();

  function waitForTitle() {
    return driver.getTitle().then(function(title) {
      return (title === 'doneRendering' || title === 'failedRendering') ? title : false;
    });
  }

  function renderSuccess(value) {
    console.log(value);
    if (value === 'doneRendering') {
      // do we want to have a POST return a pdf?
//      res.redirect('/downloadTemplate/' + hashData.renderId);
      res.send(201, {url: '/downloadTemplate/' + hashData.renderId});
    } else {
      res.send(500, 'Batik Rendering Error');
    }
  }

  function renderError(error) {
    res.send(500, error);
    driver.quit();
  }
}

/*
 Type: GET
 Url: /templateTempData/:renderId
 Description: Fetches temp data sent to createTemplatePost
 Params:{
 renderId: The temp ID render session
 }
 Returns: Temp Data JSON
 */
function getTemplateTempData(req, res) {
  var key = "renderTemplate:data:" + req.params.renderId;
  var result = redisClient.get(key, function(err,reply){
    if(!reply){
      res.send(404);
      return;
    }

    redisClient.del(key);
    res.send(reply);
  });

  if(!result) res.send(500);
}

/*
 Type: POST
 Url: /renderTemplate
 Description: Takes a merged <SVG> template, sends to Batik, then saves PDF
 Post params:{
 svgTemplate: The <SVG> you want to turn into a pdf
 renderId: The temporary id for the render session
 }
 Returns: 200 when successfully saved, 500 otherwise
 */
function renderTemplate(req, res) {
  var options = {
    url: 'http://default-environment-n3qmimrip3.elasticbeanstalk.com/V1/renderRequest',
    form: {
      fileType: 'PDF',
      svgFile: req.body.svgTemplate
    }
  };

  var postRequest = request.post(options, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      console.log('--- failed rendering');
      res.send(500);
    }
  });

  var fileStream = fs.createWriteStream(req.body.renderId + '.pdf');

  // take the streamed file from postRequest and save it
  postRequest.pipe(fileStream);

  // redirect once file is done saving
  fileStream.on('finish', function(err) {
    res.send(200);
  });
}

/*
 Type: GET
 Url: /downloadTemplate/:renderId
 Description: Downloads the temporary pdf file then deletes it
 params:{
 renderId: The temporary id for the render session
 }
 Returns: PDF file
 */
function downloadTemplate(req, res) {

  // uncomment to open in browser
//      var readStream = fs.createReadStream(path);
//      readStream.pipe(res);

  // uncomment to download file
  res.download(req.params.renderId + '.pdf', 'renderedTemplate.pdf', function(err) {
    fs.unlink(req.params.renderId + '.pdf');
  });
}

module.exports = {
  createTemplateGet: createTemplateGet,
  createTemplatePost: createTemplatePost,
  getTemplateTempData: getTemplateTempData,
  renderTemplate: renderTemplate,
  downloadTemplate: downloadTemplate
};