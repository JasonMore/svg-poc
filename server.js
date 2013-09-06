/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./server/routes'),
  http = require('http'),
  path = require('path'),
  socketService = require('./server/socket_service');

var app = express();

//noinspection JSCheckFunctionSignatures,JSValidateTypes
app.configure(function () {
//  app.set('port', process.env.PORT || 3000);
  app.set('port', process.env.VMC_APP_PORT || 3000);
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'app')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});
//var congoServer = require("./server/mongoapi_server")(app);
app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

socketService.start(server);
