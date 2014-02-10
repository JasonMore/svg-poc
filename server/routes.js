var http = require('http'),
  url = require('url');
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