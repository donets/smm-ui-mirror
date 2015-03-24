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
        aboutLink.click().then(function() {
            var text = element.all(by.css('.b-main-slogan h2 span')).first();
            text.getText().then(function(text){
                expect(text).toBe('ENTDECKE SOMUCHMORE');
            });
        });
        done();
    });

    it('should see title on the impressum page', function(done) {
        var aboutLink = element(by.cssContainingText('.b-footer-nav__menu a', 'Impressum'));
        aboutLink.click().then(function() {
            var text = element.all(by.css('.b-main-slogan h2 span')).first();
            text.getText().then(function(text){
                expect(text).toBe('IMPRESSUM (ANGABEN GEMÄSS § 5 TMG)');
            });
        });
        done();
    });

    it('should see title on the agb page', function(done) {
        var aboutLink = element(by.cssContainingText('.b-footer-nav__menu a', 'AGB'));
        aboutLink.click().then(function() {
            var text = element.all(by.css('.b-main-slogan h2 span')).first();
            text.getText().then(function(text){
                expect(text).toBe('ALLGEMEINE GESCHÄFTSBEDINGUNGEN');
            });
        });
        done();
    });

    it('should see title on the faq page', function(done) {
        var aboutLink = element(by.cssContainingText('.b-footer-nav__menu a', 'faq'));
        aboutLink.click().then(function() {
            var text = element(by.css('.about h1 span'));
            text.getText().then(function(text){
                expect(text).toBe('Guide to Somuchmore');
            });
        });
        done();
    });
});
