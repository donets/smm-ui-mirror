'use strict';

module.exports = {
	baseUrl: 'http://localhost:9000',
	waitPOST: 20000,
	waitUI: 10000,
	waitImport: 300000,
	conString: {
		user: 'smmre',
		password: 'PM2sEMC17iU8i2KrdbSJ',
		database: 'stage_events',
		host: 'pg-smm.maketank.net',
		port: 5432,
		ssl: true
		},
    signup: {
        firstName: 'Max',
        lastName: 'Musterman',
        password: '123456',
        emailSuffix: '+test@somuchmore.org',
        email: 'test@somuchmore.org',
        card: {
            number: '5555555555554444',
            cvc: '123',
            exp_year: '2030',
            exp_month: '1'
        },
        address: 'Teststr. 1',
        zipCode: '10123'
    },
    admin: {
	    email: 'admin@test.com',
        password: 'Test1234'

    },

    helpers: {
        requestsToComplete: function() {
            return browser.executeAsyncScript(function() {
                var cb = arguments[arguments.length - 1];
                angular.element(document.querySelector('#app-container'))
                    .injector().get('$browser')
                    .notifyWhenNoOutstandingRequests(function() {
                        cb();
                    });
            });
        },

        waitForElemPresent: function(elem) {
            browser.wait(function() {
                return browser.isElementPresent(elem);
            });
        },

        waitForElemDisplayed: function(elem) {
            browser.wait(function() {
                return elem.getWebElement().isDisplayed();
            });
        },

        waitForElem: function(elem) {
            browser.wait(function() {
                return browser.isElementPresent(elem);
            });

            browser.wait(function() {
                return elem.getWebElement().isDisplayed();
            });
        },

        hasClass: function(element, cls) {
            return element.getAttribute('class').then(function(classes) {
                return classes.split(' ').indexOf(cls) !== -1;
            });
        }
    }
};
