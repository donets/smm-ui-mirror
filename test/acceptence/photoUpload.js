/* global browser, element, by */

'use strict';

describe('Given the Kurse Page, User', function() {
    beforeEach(function() {
        browser.get('/');
        waitForElem(element(by.css('#login')));
    });

    var params = browser.params,
        waitForElem = params.helpers.waitForElem,
        waitForElemDisplayed = params.helpers.waitForElemDisplayed,
        waitForElemPresent = params.helpers.waitForElemPresent,
        myPassword = params.signup.password;
    var path = require('path');
    browser.driver.manage().window().maximize();

    it('should upload photo', function(done) {
        var login = element(by.css('#login'));
        waitForElem(login);
        login.click();

        element(by.css('form[name="loginForm"] input[name="email"]')).sendKeys(params.signup.email);
        element(by.css('form[name="loginForm"] input[name="password"]')).sendKeys(params.signup.password);
        element(by.css('form[name="loginForm"] button[type="submit"]')).click();

        waitForElemPresent(element(by.css('#account')));
        waitForElemDisplayed(element(by.css('#account a')));
        expect(element(by.css('#account a')).getText()).toContain(params.signup.firstName + ' ' + params.signup.lastName);

        waitForElemPresent(element(by.css('.dashboard-title')));
        waitForElemPresent(element(by.css('#account')));
        waitForElemDisplayed(element(by.css('#account a')));

        element(by.css('#account')).click();

        var accountLink = element.all(by.css('.b-header-nav_login-widget ul li')).get(1);
        waitForElemPresent(accountLink);
        accountLink.click();

        browser.sleep(1000);

        var mainCart = element.all(by.css('.tab-nav li a')).get(0);
        waitForElemPresent(mainCart);
        mainCart.click();

        browser.sleep(1000);

        var showUploadForm = element.all(by.css('.photo button')).get(0);
        waitForElemPresent(showUploadForm);
        showUploadForm.click();

        browser.sleep(1000);


        var chooseFileBtn = element.all(by.css('.button_upload input')).get(0),
            fileToUpload = '../../app/images/alexandra.jpg',
            absolutePath = path.resolve(__dirname, fileToUpload);
        browser.executeScript('$(\'.button_upload input\').css("visibility", "visible");');
        browser.sleep(1000);

        waitForElemPresent(chooseFileBtn);
        // browser.sleep(40000);
        chooseFileBtn.sendKeys(absolutePath);

        browser.sleep(3000);

        var sendPhotoBtn = element.all(by.css('.action .upload_button')).get(0);
        sendPhotoBtn.click();

        browser.sleep(5000);

        var photo = element.all(by.css('.photo img')).get(0);
        waitForElemPresent(photo);

        waitForElemPresent(element(by.css('#account')));
        waitForElemDisplayed(element(by.css('#account a')));
        element(by.css('#account')).click();

        waitForElemPresent(element(by.css('.logout')));
        element(by.css('.logout')).click();

        waitForElem(element(by.css('#login')));

        done();
    });
});
