var createRedisClient = require('redis').createClient,
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

module.exports = {
  client: redis,
  observer: redisObserver
};