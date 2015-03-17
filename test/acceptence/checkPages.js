/* global browser, element, by */

'use strict';

describe('Given a set of info pages, User', function() {

    var params = browser.params;

    beforeEach(function() {
        browser.get('/');
    });

    browser.driver.manage().window().maximize();

    it('should see title on the about page', function(done) {
        var aboutLink = element(by.cssContainingText('.b-footer-nav__menu a', 'Über uns'));
        aboutLink.click();

        var text = element.all(by.css('.b-main-slogan h2 span')).first();
        expect(text.getText()).toBe('ENTDECKE SOMUCHMORE');
        done();
    });

    it('should see title on the impressum page', function(done) {
        var aboutLink = element(by.cssContainingText('.b-footer-nav__menu a', 'Impressum'));
        aboutLink.click();

        var text = element.all(by.css('.b-main-slogan h2 span')).first();
        expect(text.getText()).toBe('IMPRESSUM (ANGABEN GEMÄSS § 5 TMG)');
        done();
    });

    it('should see title on the agb page', function(done) {
        var aboutLink = element(by.cssContainingText('.b-footer-nav__menu a', 'AGB'));
        aboutLink.click();

        var text = element.all(by.css('.b-main-slogan h2 span')).first();
        expect(text.getText()).toBe('ALLGEMEINE GESCHÄFTSBEDINGUNGEN');
        done();
    });

    it('should see title on the faq page', function(done) {
        var aboutLink = element(by.cssContainingText('.b-footer-nav__menu a', 'faq'));
        aboutLink.click();

        var text = element(by.css('.about h1 span'));
        expect(text.getText()).toBe('Guide to Somuchmore');
        done();
    });
});
