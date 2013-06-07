basePath = '';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/components/angularjs-bower/angular.js',
  {pattern: 'app/components/angularjs-bower/angular.min.js', included: false, served: false},
  'app/components/angularjs-bower/*.js',
  'app/js/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
