exports.config = {
    allScriptsTimeout: 11000,

    specs: [
        'acceptance/*.js'
    ],

    onPrepare: function(){
        global.isAngularSite = function(flag){
            browser.ignoreSynchronization = !flag;
        };
    },

    capabilities: {
        'browserName': 'chrome'
    },

    params: {
        signup: {
            firstName: 'Max',
			lastName: 'Musterman',
            password: '12345',
			emailSuffix: '+test@somuchmore.org',
			card: {
				number: '5555555555554444',
				cvc: '123',
				exp_year: '2030',
				exp_month: '1'
			},
			address: 'Teststr. 1',
			zipCode: '10123'
        }
    },

    baseUrl: 'http://127.0.0.1:9090/',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    },

    rootElement: '.ng-scope'

};
