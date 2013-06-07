basePath = '';

//noinspection JSUnresolvedVariable
files = [
  ANGULAR_SCENARIO,
  //'app/components/angularjs-bower/angular-scenario.js',
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

singleRun = true;

proxies = {
  '/': 'http://localhost:3000/'
};

junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'e2e'
};
