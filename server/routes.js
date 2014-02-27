var http = require('http'),
  url = require('url'),
  renderTemplate = require('./renderTemplate');
/*
 * GET home page.
 */

exports.setup = function(app) {
  app.get('/', index);
  app.get('/createTemplate/:templateId', renderTemplate.createTemplateGet);
  app.post('/createTemplate/:templateId', renderTemplate.createTemplatePost);
  app.post('/renderTemplate', renderTemplate.renderTemplate);
  app.get('/downloadTemplate/:renderId', renderTemplate.downloadTemplate);
};

function index(req, res){
  var match = /ticket=/.exec(req.url);

  if(match){
    res.redirect('/');
  }

  res.render('index.html');
}