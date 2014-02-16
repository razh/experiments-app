'use strict';
// Karma configuration
// Generated on Tue Dec 17 2013 16:34:41 GMT-0500 (EST)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    // Since karma-requirejs uses absolute paths for parent directory files
    // by default, we nned to go up a directory for relative paths to work.
    basePath: '../',

    // frameworks to use
    frameworks: ['jasmine', 'requirejs'],

    // Don't use html2js preprocessor for html files.
    preprocessors: {
      '**/*.html': []
    },

    // list of files / patterns to load in the browser
    files: [
      'canvas-animation/test/test-main.js',
      {pattern: 'canvas-animation/js/**/*.js', included: false},
      {pattern: 'canvas-animation/test/**/*Spec.js', included: false},
      // Load templates.
      {pattern: 'canvas-animation/js/**/*.html', included: false},

      // Load component dependencies.
      {pattern: 'app/bower_components/backbone/backbone.js', included: false},
      {pattern: 'app/bower_components/jquery/dist/jquery.js', included: false},
      {pattern: 'app/bower_components/underscore/underscore.js', included: false},
      {pattern: 'app/bower_components/requirejs-text/text.js', included: false}
    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)

    // We use Chrome because PhantomJS is missing Function.prototype.bind.
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
