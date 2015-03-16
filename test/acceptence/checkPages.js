/* global browser, element, by */

'use strict';

describe('Given a set of info pages, User', function() {

    var params = browser.params,
        waitForElem = params.helpers.waitForElem;

    beforeEach(function() {
        browser.get('/');
        waitForElem(element(by.css('#login')));
    });

    browser.driver.manage().window().maximize();

    it('should see title on the about page', function(done) {
        var aboutLink = element(by.cssContainingText('.b-footer-nav__menu a', 'Über uns'));
        waitForElem(aboutLink);
        aboutLink.click();

        var text = element.all(by.css('.b-main-slogan h2 span')).first();
        waitForElem(text);
        expect(text.getText()).toBe('ENTDECKE SOMUCHMORE');
        done();
    });

    it('should see title on the impressum page', function(done) {
        var aboutLink = element(by.cssContainingText('.b-footer-nav__menu a', 'Impressum'));
        waitForElem(aboutLink);
        aboutLink.click();

        var text = element.all(by.css('.b-main-slogan h2 span')).first();
        waitForElem(text);
        expect(text.getText()).toBe('IMPRESSUM (ANGABEN GEMÄSS § 5 TMG)');
        done();
    });

    it('should see title on the agb page', function(done) {
        var aboutLink = element(by.cssContainingText('.b-footer-nav__menu a', 'AGB'));
        waitForElem(aboutLink);
        aboutLink.click();

        var text = element.all(by.css('.b-main-slogan h2 span')).first();
        waitForElem(text);
        expect(text.getText()).toBe('ALLGEMEINE GESCHÄFTSBEDINGUNGEN');
        done();
    });

    it('should see title on the faq page', function(done) {
        var aboutLink = element(by.cssContainingText('.b-footer-nav__menu a', 'faq'));
        waitForElem(aboutLink);
        aboutLink.click();

        var text = element(by.css('.about h1 span'));
        waitForElem(text);
        expect(text.getText()).toBe('Guide to Somuchmore');
        done();
    });
});
