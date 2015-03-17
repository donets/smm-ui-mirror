'use strict';

var protractorParams = require('./params');

exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        'acceptence/tests.js'
    ],

    onPrepare: function() {

      var SpecReporter = require('jasmine-spec-reporter');

        jasmine.getEnv().addReporter(new SpecReporter({
            displayStacktrace: true
        }));
    },

    capabilities: {
        'browserName': 'chrome'
    },

    params: protractorParams,

    baseUrl: 'http://127.0.0.1:9001/',

    seleniumAddress: 'http://localhost:4444/wd/hub',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000,
        print: function() {}
    },

    rootElement: '.bolt-app'
};
