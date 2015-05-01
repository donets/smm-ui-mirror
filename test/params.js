'use strict';

module.exports = {
	baseUrl: 'http://localhost:9001',
	waitPOST: 20000,
	waitUI: 10000,
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
    photoUpload: {
        firstName: 'test',
        lastName: 'test',
        password: 'password',
        emailSuffix: '+test@somuchmore.org',
        email: 'rocketblr@gmail.com'
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
