/* global browser, element, by */

'use strict';

describe('Given signup form, User', function() {

    beforeEach(function() {
        browser.get('/');
        browser.driver.manage().deleteAllCookies()
    });

    var randomUuid = function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        params = browser.params,
        myEmail = randomUuid() + params.signup.emailSuffix,
        myPassword = params.signup.password;

    browser.driver.manage().window().maximize();

    it('should be able to signup', function(done) {
        browser.get('/signup');
        expect(browser.getCurrentUrl()).toContain('/p/signup');

        element(by.css('#name')).sendKeys(params.signup.firstName);
        element(by.css('#surname')).sendKeys(params.signup.lastName);
        element(by.css('#email')).sendKeys(myEmail);
        element(by.css('#password')).sendKeys(myPassword);

        element(by.css('#step1 button[type="submit"]')).click();

        browser.executeScript('window.scrollTo(0,document.body.scrollHeight);');

        var typeButton0 = element.all(by.repeater('card in cards'))
            .get(0).element(by.css('button'));
        browser.sleep(1000);
//        expect(element.all(by.css(".signup-nav li a")).get(1).getAttribute('class')).toMatch('active');
        typeButton0.click();

        element(by.css('#cardNumber')).sendKeys(params.signup.card.number);
        element(by.css('#cardCVC')).sendKeys(params.signup.card.cvc);
        element(by.css('#exp_year_chosen span')).click();

        var expYear = element.all(by.css('#exp_year_chosen li')).first();
        element(by.cssContainingText('#exp_year_chosen li', params.signup.card.exp_year)).click();

        var expMonth = element(by.css('#exp_month_chosen span'));
        expMonth.click();

        var expMonthElem = element.all(by.cssContainingText('#exp_month_chosen li', params.signup.card.exp_month)).first();
        expMonthElem.click();

        element(by.css('#street')).sendKeys(params.signup.address);
        element(by.css('#zip')).sendKeys(params.signup.zipCode);

        var approve = element(by.css('label[for=approve]'));
        approve.click();

        var submitOrderButton = element(by.css('#step3 button[type="submit"]'));
        submitOrderButton.click();

        done();
    });

    it('should be able to enter credentials and signin into existing account', function(done) {

        var login = element(by.css('#login'));
        login.click();

        element(by.css('form[name="loginForm"] input[name="email"]')).sendKeys(myEmail);
        element(by.css('form[name="loginForm"] input[name="password"]')).sendKeys(myPassword);
        element(by.css('form[name="loginForm"] button[type="submit"]')).click();

        expect(element(by.css('#account a')).getText()).toContain(params.signup.firstName + ' ' + params.signup.lastName);

        done();
    });
});
