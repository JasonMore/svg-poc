var express = require('express'),
  http = require('http'),
  cas = require('connect-cas'),
  setupExpress = require('./server/setup/express'),
  routes = require('./server/routes'),
  racer = require('./server/setup/racer')
  ;

cas.configure({
  hostname: 'dev-dmz-las.lifetouch.net',
  paths: {
    serviceValidate: '/las2/serviceValidate',
    login: '/las2/login'
  }
});

// configure express
var app = express();
setupExpress.configure(app, __dirname);


// Setup app infrustructure
routes.setup(app);
racer.setup(app);

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});