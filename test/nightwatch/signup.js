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
	  .url(params.baseUrl + '/?city=B')
      .url(params.baseUrl + '/p/signup/')
      .windowMaximize()
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
      .waitForElementVisible('div[id=step2]', 3000)
      .pause(2000) //wait for scrolling to pass the next assert correctly
      .verify.attributeEquals('nav.signup-nav > ul > li:nth-of-type(2) > a','class','active') //verify that step highlighted correctly
      .click('.select-cards > ul:nth-of-type(3) > li.card-button > button') //ul:nth-of-type(3) specifies the card (2-4)
  },

  'Fill the form step 3': function (browser) {

    var params = browser.globals;

    browser
      .waitForElementVisible('form[id=step3]', 2000)
      .pause(2000) //wait for scrolling to pass the next assert correctly
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
      .moveTo('#approve')
      .click('#approve')
      .verify.attributeEquals('#approve','class','ng-dirty ng-valid ng-valid-required')
  },

  'Submit form and assert welcome': function (browser) {
    browser
      .click('#step3 > div.w-clear > button')
      .waitForElementPresent('.modal-dialog',10000)
      .end();
  }
};
