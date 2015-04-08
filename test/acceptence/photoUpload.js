/* global browser, element, by */

'use strict';

describe('Given the Kurse Page, User', function() {
    beforeEach(function() {
        browser.get('/');
    });

    afterEach(function() {
        browser.driver.manage().deleteAllCookies();
    });

    var params = browser.params,
        myPassword = params.photoUpload.password;
    var path = require('path');
    browser.driver.manage().window().maximize();

    it('should upload photo', function(done) {
        var login = element(by.css('#login'));
        login.click();

        element(by.css('form[name="loginForm"] input[name="email"]')).sendKeys(params.photoUpload.email);
        element(by.css('form[name="loginForm"] input[name="password"]')).sendKeys(params.photoUpload.password);
        element(by.css('form[name="loginForm"] button[type="submit"]')).click();

        expect(element(by.css('#account a')).getText()).toContain(params.photoUpload.firstName + ' ' + params.photoUpload.lastName);

        element(by.css('.success button')).click();
        element(by.css('#account')).click();

        var accountLink = element.all(by.css('.b-header-nav_login-widget ul li')).get(1);
        accountLink.click();

        browser.sleep(1000);

        var mainCart = element.all(by.css('.tab-nav li a')).get(0);
        mainCart.click();

        browser.sleep(1000);

        var showUploadForm = element.all(by.css('.photo .env-upload-box div')).get(0);
        showUploadForm.click();

        browser.sleep(1000);


        var chooseFileBtn = element.all(by.css('.button_upload input')).get(0),
            fileToUpload = '../../app/images/alexandra.jpg',
            absolutePath = path.resolve(__dirname, fileToUpload);
        browser.executeScript('$(\'.button_upload input\').css("visibility", "visible");');
        browser.sleep(1000);

        // browser.sleep(40000);
        chooseFileBtn.sendKeys(absolutePath);

        browser.sleep(3000);

        var sendPhotoBtn = element.all(by.css('.action .upload_button')).get(0);
        sendPhotoBtn.click();

        browser.sleep(5000);

        var photo = element.all(by.css('.photo img')).get(0);

        done();
    });
});
