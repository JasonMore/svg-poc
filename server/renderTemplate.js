var request = require('request'),
  fs = require('fs'),
  spawn = require('child_process').spawn;

function createTemplate(req, res) {
  var phantom = spawn('phantomjs', ['./phantomjs/downloadSvg.js']);


  phantom.on('close', function(code, signal) {
    // redirect here
    res.redirect('/downloadTemplate');
//    console.log('child process terminated due to receipt of signal '+signal);
  });
}

function renderTemplate(req, res) {
  console.log('--- start rendering');
  var options = {
    url: 'http://default-environment-n3qmimrip3.elasticbeanstalk.com/V1/renderRequest',
    form: {
      fileType: 'PDF',
      svgFile: req.body.svgTemplate
    }
  };

  request.post(options, function(error, response, body) {
//    debugger;
//    response.pipe(fs.createWriteStream('out.pdf'));
    if (!error && response.statusCode == 200) {
      console.log('--- success rendering')
      res.send(200);
    } else {
      console.log('--- failed rendering')
      res.send(500);
    }
  })
    .pipe(fs.createWriteStream('doodle.pdf'));

}

var path = 'doodle.pdf';

function downloadTemplate(req, res) {

  var count = 0;

  checkForPath();

  function checkForPath() {
    if (!fs.existsSync(path)) {
      count++;
      if(count > 1000){
        res.end();
        return;
      }
      setTimeout(checkForPath, 10);
      return;
    }

    var readStream = fs.createReadStream(path);
    readStream.pipe(res);
  }
}

module.exports = {
  createTemplate: createTemplate,
  renderTemplate: renderTemplate,
  downloadTemplate: downloadTemplate
};