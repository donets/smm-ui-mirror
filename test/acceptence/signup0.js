/* global browser, element, by */

'use strict';


describe('Signup0', function() {

	var randomUuid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	};
	
    beforeEach(function() {
        isAngularSite(false);

    });

    var params = browser.params;

    it('should register successfully', function() {

        browser.get('/signup');
		browser.waitForAngular();
		expect(browser.getCurrentUrl()).toContain('/p/signup/');

		element( by.model('order.firstName') ).sendKeys( params.signup.firstName );
		element( by.model('order.lastName') ).sendKeys( params.signup.lastName );
		element( by.model('order.email') ).sendKeys( randomUuid() + params.signup.emailSuffix  );
		element( by.model('order.password') ).sendKeys( params.signup.password );
		element( by.name('next') ).click();
		
		browser.waitForAngular();
		var typeButton0 = element.all(by.repeater('card in cards')).get(0).element(by.css("button"));
		expect(typeButton0.isEnabled()).toBe(true);
		browser.actions().mouseMove(typeButton0).perform();
		browser.wait(function() {return typeButton0.isDisplayed();});
		typeButton0.click();
		
		browser.wait(function() {return browser.findElement(by.model('order.card.number')).isDisplayed();});
		element( by.model('order.card.number') ).sendKeys( params.signup.card.number);
		element( by.model('order.card.cvc') ).sendKeys( params.signup.card.cvc);
		
		element( by.css('#exp_year_chosen span') ).click();
		browser.wait(function() {return browser.findElement(by.css('#exp_year_chosen li')).isDisplayed();});
		element( by.cssContainingText('#exp_year_chosen li', params.signup.card.exp_year) ).click();
		
		browser.findElement( by.css('#exp_month_chosen span') ).click();
		browser.findElement( by.cssContainingText('#exp_month_chosen li', params.signup.card.exp_month) ).click();
		
		browser.actions().mouseMove( element( by.model('order.deliveryAddress.streetAndHouse') ) ).perform();
		browser.findElement( by.model('order.deliveryAddress.streetAndHouse') ).sendKeys( params.signup.address );
		browser.findElement( by.model('order.deliveryAddress.zip') ).sendKeys( params.signup.zipCode );
		browser.findElement( by.css('label[for=approve]') ).click();
		
		var submitOrderButton = element(By.name('submitOrder'));
		browser.actions().mouseMove( submitOrderButton );
		expect( submitOrderButton.isEnabled() ).toBe(true);
		submitOrderButton.click();		
		
		browser.driver.wait(function() { return browser.isElementPresent( by.css('#welcome-message') );});
		//browser.driver.wait(function() { return browser.isElementPresent( by.cssContainingText('h2', 'Danke') );});
    });


});
