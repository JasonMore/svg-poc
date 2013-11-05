// Karma configuration
// Generated on Tue Jul 16 2013 08:25:24 GMT-0500 (CDT)

module.exports = function(karma) {
  karma.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: ['jasmine'],

    preprocessors : {
      '**/*.html': ['ng-html2js']
    },

//    plugins: ['ng-html2js'],

    // list of files / patterns to load in the browser
    files: [
      // -- add libraries here as they are added to index.html
      'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js',
      'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js',
      'http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js',
      'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/1.3.1/lodash.min.js',
      'app/lib/jquery.menu-aim.js',
      'app/lib/jquery.svg.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.1.5/angular.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.1.5/angular-resource.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.0.1/angular-ui-router.js',
      'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.5.0/ui-bootstrap-tpls.min.js',
      // end of libraries

      // testing libraries
      'http://code.angularjs.org/1.1.5/angular-mocks.js',
      'test/_mocks/**/*.js',

      // app code
      'app/modules/**/*.js',
      'app/modules/**/*.html',

      // app tests
      'test/unit/**/*.js'
//      '*.html'

//      'test/unit/**/*.html'
    ],



    ngHtml2JsPreprocessor: {
    // strip this from the file path
    stripPrefix: 'app/',
      // prepend this to the
//      prependPrefix: 'served/',

      // or define a custom transform function
//      cacheIdFromPath: function (filepath) {
//        return cacheId;
//      },

    // setting this option will create only a single module that contains templates
    // from all the files, so you can load them all with module('foo')
    moduleName: 'preloadAllHtmlTemplates'
  },


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
