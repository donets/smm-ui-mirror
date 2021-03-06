// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-08-26 using
// generator-karma 0.8.3

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/underscore/underscore.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/videogular/videogular.js',
      'bower_components/videogular-controls/controls.js',
      'bower_components/videogular-buffering/buffering.js',
      'bower_components/videogular-overlay-play/overlay-play.js',
      'bower_components/videogular-poster/poster.js',
      'bower_components/angulartics/src/angulartics.js',
      'bower_components/angulartics/src/angulartics-ga.js',
      'bower_components/angulartics/src/angulartics-gtm.js',
      'bower_components/angular-easyfb/angular-easyfb.js',
      'bower_components/lodash/dist/lodash.compat.js',
      'bower_components/angular-google-maps/dist/angular-google-maps.js',
      'bower_components/spin.js/spin.js',
      'bower_components/angular-spinner/angular-spinner.js',
      'bower_components/angular-scroll/angular-scroll.min.js',
      'bower_components/chosen-bower/chosen.jquery.js',
      'bower_components/angular-chosen-localytics/chosen.js',
      'bower_components/flow.js/dist/flow.js',
      'bower_components/ng-flow/dist/ng-flow.js',
      'bower_components/jcrop/js/jquery.Jcrop.js',
      'bower_components/angular-validation-match/dist/angular-input-match.min.js',
      'bower_components/angular-rangeslider/angular.rangeSlider.js',
      'bower_components/angular-xeditable/dist/js/xeditable.js',
      'bower_components/angular-gettext/dist/angular-gettext.js',
      'bower_components/angular-options-disabled/src/angular-options-disabled.js',
      'bower_components/angular-websocket/angular-websocket.min.js',
      'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 9001,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    //Uncomment the following lines if you are using grunt's server to run the tests
    proxies: {
       '/': 'http://localhost:9001/'
    },

   // URL root prevent conflicts with the site root
    urlRoot: '_karma_'
  });
};
