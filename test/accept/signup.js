'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

/*describe('Somuchmore App', function() {

    var prt = protractor.getInstance();
    browser.get('/');

    it('should open homepage', function() {
        expect(browser.getTitle()).toBe('Somuchmore | Yoga kommt zu Dir');
    });

});*/

describe('Signup', function() {

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




/*	describe('Phone list view', function() {

		beforeEach(function() {
			browser.get('app/index.html#/phones');
		});


		it('should filter the phone list as user types into the search box', function() {

			var phoneList = element.all(by.repeater('phone in phones'));
			var query = element(by.model('query'));

			expect(phoneList.count()).toBe(20);

			query.sendKeys('nexus');
			expect(phoneList.count()).toBe(1);

			query.clear();
			query.sendKeys('motorola');
			expect(phoneList.count()).toBe(8);
		});


		it('should be possible to control phone order via the drop down select box', function() {

			var phoneNameColumn = element.all(by.repeater('phone in phones').column('{{phone.name}}'));
			var query = element(by.model('query'));

			function getNames() {
				return phoneNameColumn.map(function(elm) {
					return elm.getText();
				});
			}

			query.sendKeys('tablet'); //let's narrow the dataset to make the test assertions shorter

			expect(getNames()).toEqual([
			                            "Motorola XOOM\u2122 with Wi-Fi",
			                            "MOTOROLA XOOM\u2122"
			                            ]);

			element(by.model('orderProp')).element(by.css('option[value="name"]')).click();

			expect(getNames()).toEqual([
			                            "MOTOROLA XOOM\u2122",
			                            "Motorola XOOM\u2122 with Wi-Fi"
			                            ]);
		});


		it('should render phone specific links', function() {
			var query = element(by.model('query'));
			query.sendKeys('nexus');
			element(by.css('.phones li a')).click();
			browser.getLocationAbsUrl().then(function(url) {
				expect(url.split('#')[1]).toBe('/phones/nexus-s');
			});
		});
	});


	describe('Phone detail view', function() {

		beforeEach(function() {
			browser.get('app/index.html#/phones/nexus-s');
		});


		it('should display placeholder page with phoneId', function() {
			expect(element(by.binding('phoneId')).getText()).toBe('nexus-s');
		});
	});
*/

