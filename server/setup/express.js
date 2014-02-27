var express = require('express'),
  path = require('path');

function configure(app, rootDir){
  console.log('path resolve', path.resolve(rootDir, '/views'));
  console.log('path actual', rootDir + '/views');


  app.set('port', process.env.VMC_APP_PORT || process.env.PORT || 3000);
  app.set('views', rootDir + '/views');
  app.engine('html', require('ejs').renderFile);

  //uncomment for cas validation
//  app.use(express.cookieParser('derp secret key'));
//  app.use(express.cookieSession());
//  app.use(cas.serviceValidate());
//  app.use(cas.authenticate());

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(rootDir, 'app')));

  app.configure('development', function() {
    app.use(express.errorHandler());
  });
}

module.exports = {
  configure: configure
};