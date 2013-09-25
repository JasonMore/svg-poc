/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./server/routes'),
  http = require('http'),
  path = require('path'),
  racer = require('racer'),
  liveDbMongo = require('livedb-mongo')
  ;


// configure express
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

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

///
// Racer Config
///

//Get Redis configuration
if (process.env.REDIS_HOST) {
  var redis = require('redis').createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
  redis.auth(process.env.REDIS_PASSWORD);
} else if (process.env.REDISCLOUD_URL) {
  var redisUrl = require('url').parse(process.env.REDISCLOUD_URL);
  var redis = require('redis').createClient(redisUrl.port, redisUrl.hostname);
  redis.auth(redisUrl.auth.split(":")[1]);
} else {
  var redis = require('redis').createClient();
}

// configure mongo
var mongoUrl = process.env.MONGO_URL || process.env.MONGOHQ_URL ||
  'mongodb://localhost:27017/project';

// configure racer.js store
var store = racer.createStore({
  server: server,
  db: liveDbMongo(mongoUrl + '?auto_reconnect', {safe: true}),
  redis: redis
});

app.use(require('racer-browserchannel')(store));
app.use(store.modelMiddleware());


app.get('/racerInit', function (req, res) {
  var model = store.createModel({fetchOnly: true}, req);
  model.bundle(function (err, bundle) {
    if (err) {
      res.status(500);
      res.send(err);
    } else {
      res.send(JSON.stringify(bundle));
    }
  });
});

// TODO: figure out how to have more than one of these
store.bundle(__dirname + '/server/modules/liveResource.js', function (err, js) {
  app.get('/serverModules-script.js', function (req, res) {
    res.type('js');
    res.send(js);
  });
});

