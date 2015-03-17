/* global browser, element, by */

'use strict';

describe('Given the Home Page, User', function() {

    beforeEach(function() {
        browser.get('/');
    });

    var params = browser.params;

    browser.driver.manage().window().maximize();

    it('should see title on the home page', function(done) {
        var text = element(by.css('.b-main-slogan h2 span:first-child'));

        expect(text.getText()).toBe('BERLIN IST DEIN STUDIO');
        done();
    });

    it('should see MÜNCHEN title on the MÜNCHEN Home Page', function(done) {
        browser.executeScript('window.location = \"/?city=M\";');

        var text = element(by.css('.b-main-slogan h2 span:first-child'));

        expect(text.getText()).toBe('MÜNCHEN IST DEIN STUDIO');
        done();
    });
});
