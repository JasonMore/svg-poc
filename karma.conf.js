// Karma configuration
// Generated on Tue Jul 16 2013 08:25:24 GMT-0500 (CDT)

module.exports = function(karma) {
  karma.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],

//    preprocessors: {
//      'test/unit/**/*.html': ['ng-html2js']
//    },

//    plugins: ['ng-html2js'],

    // list of files / patterns to load in the browser
    files: [
      // -- add libraries here as they are added to index.html
      'app/components/jquery/jquery.js',
      'app/components/jquery-ui/ui/jquery-ui.js',
      'app/components/bootstrap-css/js/bootstrap.js',
      'app/components/jquery.svg/jquery.svg.js',
      'app/components/lodash/dist/lodash.js',
      'app/components/angularjs-bower/angular.js',
      'app/components/angularjs-bower/angular-resource.js',
      'app/components/angularjs-bower/angular-cookies.js',
      'app/components/angularjs-bower/angular-sanitize.js',
      'app/components/angular-ui-router/release/angular-ui-router.js',
      'app/components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/components/svg.js/dist/svg.js',
      'app/components/svg.draggable.js/svg.draggable.js',
      // end of libraries

      'app/components/angularjs-bower/angular-mocks.js',
      'app/modules/**/*.js',
      'test/unit/**/*.js',
//      'test/unit/**/*.html'
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // cli runner port
    runnerPort: 9100,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
    logLevel: karma.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
