basePath = '';

//noinspection JSUnresolvedVariable
files = [
  JASMINE,
  JASMINE_ADAPTER,
  {pattern: 'app/components/angularjs-bower/*.min.js', included: false, served: false},
  'app/components/angularjs-bower/angular.js',
  // -- add angular plugins here as they are added to index.html
  'app/components/angularjs-bower/angular-mocks.js',
  'app/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
