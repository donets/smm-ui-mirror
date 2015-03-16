/* global browser, element, by */

'use strict';

describe('Given an invite form, User', function() {

    beforeEach(function() {
        browser.get('/');
        waitForElem(element(by.css('#login')));
    });

    var params = browser.params,
        waitForElem = params.helpers.waitForElem;

    browser.driver.manage().window().maximize();

    it('should be able to invite someone', function(done) {
        var email = element(by.css('form[name="subscribeForm.header"] input[name="email"]'));
        var zipCode = element(by.css('form[name="subscribeForm.header"] input.zip'));
        var formButton = element(by.css('form[name="subscribeForm.header"] input[type=\'submit\']'));
        var successMessage = element.all(by.css('.subscribe-wrapper .form-response .form-success')).first();
        waitForElem(formButton);

        email.sendKeys(params.signup.email);
        zipCode.sendKeys(params.signup.zipCode);
        formButton.click();

        waitForElem(successMessage);
        expect(successMessage.isDisplayed()).toBe(true);
        done();
    });
});
