/* global browser, element, by */

'use strict';

describe('Given password reset from, User', function() {

    beforeEach(function() {
        browser.get('/');
    });

    var params = browser.params;

    browser.driver.manage().window().maximize();

    it('should be able to reset his password', function(done) {
        var login = element(by.css('.b-header-nav li#login'));
        login.click();

        var forgotPw = element.all(by.css('.forgot-password')).first();
        forgotPw.element(by.css('span')).click();

        element(by.model('emailForgot')).sendKeys(params.signup.email);
        element(by.css('form[name="forgotForm"] button[type="submit"]')).click();

        browser.sleep(1000);

//        browser.get('http://shitmail.me/mail/inbox/somuchmore@shitmail.me');
//        var btn = element(by.cssContainingText('a', 'Passwort reset request'));
//        btn.click();
//
//        browser.driver.executeScript(function() {
//            return document.querySelectorAll('.boxContent')[1].innerText.match('https.*')[0];
//        }).then(function(result) {
//            browser.get(result);
//        });
//
//        var resetPage = element(by.css('.b-main-slogan'));
//        expect(browser.getCurrentUrl()).toContain('/p/password');
//
//        element(by.css('form.b-card-subscribe input[type="password"]')).sendKeys(params.signup.password);
//        element(by.css('form.b-card-subscribe button[type="submit"]')).click();

        done();
    });
});
