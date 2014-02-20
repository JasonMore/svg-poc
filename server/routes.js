var http = require('http'),
  url = require('url'),
  renderTemplate = require('./renderTemplate');
/*
 * GET home page.
 */

exports.index = function(req, res){
  var match = /ticket=/.exec(req.url);

  if(match){
    res.redirect('/');
  }

  res.render('index.html');
};

exports.renderTemplate = function(req,res){
  renderTemplate.test();
  res.end();
//  res.render('index.html');
}