var http = require('http'),
  url = require('url'),
  renderTemplate = require('./service/renderTemplate'),
  template = require('./service/templateType');
/*
 * GET home page.
 */

exports.setup = function(app) {
  app.get('/', index);
  app.get('/createTemplate/:templateId', renderTemplate.createTemplateGet);
  app.post('/createTemplate/:templateId', renderTemplate.createTemplatePost);
  app.get('/getTemplateTempData/:renderId', renderTemplate.getTemplateTempData);
  app.post('/renderTemplate', renderTemplate.renderTemplate);
  app.get('/downloadTemplate/:renderId', renderTemplate.downloadTemplate);

  app.put('/api/templateType', template.create);
  app.get('/api/templateType/:id', template.get);
  app.del('/api/templateType/:id', template.del);
};

function index(req, res){
  var match = /ticket=/.exec(req.url);

  if(match){
    res.redirect('/');
  }

  res.render('index.html');
}