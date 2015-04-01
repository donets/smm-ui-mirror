module.exports = {
  tags: ['signup'],
  
  'Fill the form step 1': function (browser) {
	  var params = browser.globals;
	  var randomUuid = function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
	  
	browser
    .url(params.baseUrl + '/p/signup/')
    .waitForElementVisible('body', 2000)
	.waitForElementVisible('nav.signup-nav', 1000)
	.assert.attributeEquals('nav.signup-nav > ul > li:nth-of-type(1) > a','class','active') //verify that step highlighted correctly
	.setValue('input[id=name]',params.signup.firstName)
	.setValue('input[id=surname]',params.signup.lasstName)
	.setValue('input[id=email]',randomUuid()+params.signup.emailSuffix)
	.setValue('input[id=password]',params.signup.password)
	.click('button[type=submit]')
  },
  
  'Fill the form step 2': function (browser) {
	browser
    .waitForElementVisible('div[id=step2]', 2000)
	.pause(1000) //wait for scrolling to pass the next assert correctly
    .verify.attributeEquals('nav.signup-nav > ul > li:nth-of-type(2) > a','class','active') //verify that step highlighted correctly
	.click('.select-cards > ul:nth-of-type(3) >li.card-button > button') //ul:nth-of-type(3) specifies the card (2-4)
  },
  
  'Fill the form step 3': function (browser) {
	  
	var params = browser.globals;
	  
	browser
    .waitForElementVisible('form[id=step3]', 2000)
	.pause(1000) //wait for scrolling to pass the next assert correctly
    .verify.attributeEquals('nav.signup-nav > ul > li:nth-of-type(3) > a','class','active') //verify that step highlighted correctly
	.setValue('input[id=cardNumber]',params.signup.card.number)
	.moveTo('#exp_month_chosen span')
	.click('#exp_month_chosen span')
	.click('li.active-result:nth-child('+params.signup.card.exp_month+')')
	.moveTo('#exp_year_chosen span')
	.click('#exp_year_chosen span')
	//.moveTo('li.active-result:contains("'+params.signup.card.exp_year+'")')
	.click('#exp_year_chosen > div:nth-child(2) > ul:nth-child(2) > li:nth-child(17)') //could not parametrise correctly because somehow pseudo class :contains() is not working in CSS selector - had to use static :nth-child...
	.setValue('input[id=cardCVC]',params.signup.card.cvc)
	.setValue('input[id=name]',params.signup.firstName)
	.setValue('#street','testStreet123')
	.setValue('#zip','123123')
	.click('div.form-check >input')
	.click('.large')
	.waitForElementPresent('.modal-body > h2:nth-child(1)',15000)
	.assert.elementPresent('.modal-body > h2:nth-child(1)')
	.end();
	
	//.click('.select-cards > ul:nth-of-type(3) >li.card-button > button') //ul:nth-of-type(3) specifies the card (2-4)
  },
  
  // 'Submit and check': function (browser) { #exp_year_chosen > div:nth-child(2) > ul:nth-child(2) > li:nth-child(4)
	  // var params = browser.globals;
	  
  // browser
    // .click('button[type=submit]')
    // .waitForElementVisible('h1 > span.ng-scope', 5000)
    // .assert.containsText('h1 > span.ng-scope', 'Finde einen Kurs')
    // .end();
  // }
};
//----------------------------------------------------------------------



        // element(by.css('#cardNumber')).sendKeys(params.signup.card.number);
        // element(by.css('#cardCVC')).sendKeys(params.signup.card.cvc);
        // element(by.css('#exp_year_chosen span')).click();

        // var expYear = element.all(by.css('#exp_year_chosen li')).first();
        // element(by.cssContainingText('#exp_year_chosen li', params.signup.card.exp_year)).click();

        // var expMonth = element(by.css('#exp_month_chosen span'));
        // expMonth.click();

        // var expMonthElem = element.all(by.cssContainingText('#exp_month_chosen li', params.signup.card.exp_month)).first();
        // expMonthElem.click();

        // element(by.css('#street')).sendKeys(params.signup.address);
        // element(by.css('#zip')).sendKeys(params.signup.zipCode);

        // var approve = element(by.css('label[for=approve]'));
        // approve.click();

        // var submitOrderButton = element(by.css('#step3 button[type="submit"]'));
        // submitOrderButton.click().then(function() {
            // expect(element(by.css('.modal-dialog h2')).getText()).toContain("Danke");
            // done();
        // });
    // });

    // it('should be able to enter credentials and signin into existing account', function(done) {

        // var login = element(by.css('#login'));
        // login.click();

        // element(by.css('form[name="loginForm"] input[name="email"]')).sendKeys(myEmail);
        // element(by.css('form[name="loginForm"] input[name="password"]')).sendKeys(myPassword);
        // element(by.css('form[name="loginForm"] button[type="submit"]')).click().then(function() {
            // expect(element(by.css('#account a')).getText()).toContain(params.signup.firstName + ' ' + params.signup.lastName);
            // done();
        // });
    // });
//});
