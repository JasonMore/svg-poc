var request = require('request'),
  fs = require('fs'),
  webdriver = require('selenium-webdriver');

var path = 'doodle.pdf';
var url = 'http://localhost:3000/#/renderTemplate/8cadc1aa-9cea-400a-9348-3090b16b66c1?dataSet=3ff12b9f-6620-4450-84fd-7cfe86905975';

function createTemplate(req, res) {
  var driver = new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

  driver.get(url);
  driver.wait(waitForTitle, 10000)
    .then(renderSuccess)
    .then(null, renderError); // catch error

  driver.quit();

  function waitForTitle() {
    return driver.getTitle().then(function(title) {
      return title === 'doneRendering' || title === 'failedRendering';
    });
  }

  function renderSuccess(value) {
    console.log(value);
    if (value === 'doneRendering') {
      res.redirect('/downloadTemplate');
    } else {
      res.send(500, 'Failed Rendering');
    }
  }

  function renderError(error) {
    res.send(500);
    driver.quit();
  }
}

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

  var fileStream = fs.createWriteStream(path);

  // take the streamed file from postRequest and save it
  postRequest.pipe(fileStream);

  // redirect once file is done saving
  fileStream.on('finish', function(err) {
    res.send(200);
  });
}

function downloadTemplate(req, res) {

  // uncomment to open in browser
//      var readStream = fs.createReadStream(path);
//      readStream.pipe(res);

  // uncomment to download file
  res.download(path);

}

module.exports = {
  createTemplate: createTemplate,
  renderTemplate: renderTemplate,
  downloadTemplate: downloadTemplate
};