// Karma configuration
// Generated on Tue Jul 16 2013 08:25:24 GMT-0500 (CDT)

module.exports = function (karma) {
  karma.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: ['jasmine'],

    preprocessors: {
      '**/*.html': ['ng-html2js']
    },

    // list of files / patterns to load in the browser
    files: [
      // -- add libraries here as they are added to index.html
      'app/components/jquery/jquery.js',
      'app/components/jquery-ui/ui/minified/jquery-ui.min.js',
      'app/components/bootstrap/dist/js/bootstrap.js',
      'app/components/lodash/dist/lodash.js',

      'app/lib/jquery.menu-aim.js',
      'app/lib/jquery.svg.js',
      'app/lib/kDown.js',

      'app/components/angular/angular.js',
      'app/components/angular-animate/angular-animate.js',
      'app/components/angular-ui-router/release/angular-ui-router.js',
      'app/lib/ui-bootstrap-tpls-0.7.0.min.js',
      'app/components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
      'app/components/select2/select2.js',
      'app/components/angular-ui-select2/src/select2.js',
      // end of libraries

      // testing libraries
      'app/components/angular-mocks/angular-mocks.js',
      'test/_mocks/**/*.js',

      // app code
      'server/modules/liveResource.js',
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
