/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./server/routes'),
  http = require('http'),
  path = require('path'),
  racer = require('racer'),
  liveDbMongo = require('livedb-mongo'),
  cas = require('connect-cas')
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

//noinspection JSCheckFunctionSignatures,JSValidateTypes
app.configure(function() {
  app.set('port', process.env.VMC_APP_PORT || process.env.PORT || 3000);
//  app.set('port', process.env.VMC_APP_PORT || 3000);
  app.set('views', __dirname + '/views');
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
  app.use(express.static(path.join(__dirname, 'app')));


});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/renderTemplate', routes.renderTemplate);

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

///
// Racer Config
///

//Get Redis configuration
var createRedisClient =  require('redis').createClient,
  redis, redisObserver;

if (process.env.REDIS_HOST) {
  redis = createRedisClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
  redis.auth(process.env.REDIS_PASSWORD);

  redisObserver = createRedisClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
  redisObserver.auth(process.env.REDIS_PASSWORD);
} else if (process.env.REDISCLOUD_URL) {
  var redisUrl = require('url').parse(process.env.REDISCLOUD_URL);
  var password = redisUrl.auth.split(":")[1];

  redis = createRedisClient(redisUrl.port, redisUrl.hostname);
  redis.auth(password);

  redisObserver = createRedisClient(redisUrl.port, redisUrl.hostname);
  redisObserver.auth(password);
} else {
  redis = createRedisClient();
  redisObserver = createRedisClient();
}

// configure mongo
var mongoUrl = process.env.MONGO_URL || process.env.MONGOHQ_URL ||
  'mongodb://localhost:27017/svgPoc';

// configure racer.js store
var livedb = require('livedb');

var store = racer.createStore({
  backend:livedb.client({
    redis:redis,
    redisObserver: redisObserver,
    db: liveDbMongo(mongoUrl + '?auto_reconnect', {safe: true})
  })
});

app.use(require('racer-browserchannel')(store));
app.use(store.modelMiddleware());

app.get('/racerInit', function(req, res) {
  var model = store.createModel({fetchOnly: true}, req);
  model.bundle(function(err, bundle) {
    if (err) {
      res.status(500);
      res.send(err);
    } else {
      res.send(JSON.stringify(bundle));
    }
  });
});

// TODO: figure out how to have more than one of these with browserify
store.bundle(__dirname + '/server/modules/liveResource.js', function(err, js) {
  app.get('/serverModules-script.js', function(req, res) {
    res.type('js');
    res.send(js);
  });
});
