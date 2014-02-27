var setupRedis = require('./redis'),
  liveDbMongo = require('livedb-mongo'),
  racer = require('racer');

// configure mongo
var mongoUrl = process.env.MONGO_URL || process.env.MONGOHQ_URL ||
  'mongodb://localhost:27017/svgPoc';

// configure racer.js store
var livedb = require('livedb');

var store = racer.createStore({
  backend: livedb.client({
    redis: setupRedis.client,
    redisObserver: setupRedis.observer,
    db: liveDbMongo(mongoUrl + '?auto_reconnect', {safe: true})
  })
});

function setup(app) {
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
  store.bundle(__dirname + '/../modules/liveResource.js', function(err, js) {
    app.get('/serverModules-script.js', function(req, res) {
      res.type('js');
      res.send(js);
    });
  });

}

module.exports = {
  store: store,
  setup: setup
};