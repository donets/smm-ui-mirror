'use strict';

module.exports = {
    signup: {
        firstName: 'Max',
        lastName: 'Musterman',
        password: '12345',
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