module.exports = {
  tags: ['login','booking','MBO','NonMBO','correct'],

  'LogIN': function (browser) {
    var params = browser.globals;
    browser
      .url(params.baseUrl + '/?city=L')
	  .waitForElementVisible('body', browser.globals.waitUI)
	  .windowMaximize()
      .waitForElementVisible('.login-link > span:nth-child(1)', browser.globals.waitUI)
	  .assert.elementPresent('.login-link > span:nth-child(1)')
      .click('.login-link > span:nth-child(1)')
	  .assert.elementPresent('input[name=email]')
	  .assert.elementPresent('input[name=password]')
      .waitForElementVisible('input[name=email]', browser.globals.waitUI)
      .setValue('input[name=email]', params.signup.email)
      .setValue('input[name=password]', params.signup.password)
      .click('button[type=submit]')
	  .waitForElementVisible('#account', browser.globals.waitPOST)
      .assert.elementPresent('#account');
	  
	  //.weekdays-dashboard > li:nth-child(2)
	  //modalsuccesmess- p.success>span>span -- Reserved for you - Request received
	  //modalcancelmess- p.cancel>span>span -- Cancelled for you - Cancelled for you
	  //requestbutton- .form-button > span:nth-child(1) -- Confirm Reservation - Request
	  //cancellbutton- .form-button > span:nth-child(1) -- Cancel Reservation - Cancel Request
	  // selector xpath- //span[text()='test#NonMBO PreBook Class']
  },

    'Go to classes and book test NonMBO NonBook class': function (browser) { 
	browser
	.waitForElementVisible("tr.ng-scope:nth-child(1) > td:nth-child(1) > p:nth-child(1)",browser.globals.waitPOST)
	.waitForElementVisible(".weekdays-dashboard > li:nth-child(2)",browser.globals.waitPOST)
    .click('.weekdays-dashboard > li:nth-child(2)')
	.waitForElementVisible(".dashboard-spinner",browser.globals.waitPOST)
	.useXpath()	
	.waitForElementVisible("//span[text()='test#NonMBO NonBook Class']",browser.globals.waitPOST)
	.click("//span[text()='test#NonMBO NonBook Class']")
	.useCss()	
	.waitForElementVisible('.modal-open', browser.globals.waitUI)//waiting for modal to open
	.verify.containsText('.form-button > span:nth-child(1)','REQUEST')//asserting book button text
	.click('.form-button > span:nth-child(1)')//requesting
	.waitForElementVisible('p.success>span>span', browser.globals.waitUI)//waiting for status message to appear
	.verify.containsText('p.success>span>span','REQUEST RECEIVED')//asserting message
	.verify.containsText('.form-button > span:nth-child(1)','CANCEL REQUEST')//asserting cancell button text
	.click('.form-button > span:nth-child(1)')//cancelling
	.waitForElementVisible('p.cancel>span>span', browser.globals.waitUI)//waiting for status message to appear
	.verify.containsText('p.cancel>span>span','CANCELLED FOR YOU')//asserting message
	.click('.modal-close')//closing modal
  },

    'Go to classes and book test NonMBO PreBook class': function (browser) { 
	browser
	.useXpath()	
	.waitForElementVisible("//span[text()='test#NonMBO PreBook Class']",browser.globals.waitPOST)
	.click("//span[text()='test#NonMBO PreBook Class']")
	.useCss()	
	.waitForElementVisible('.modal-open', browser.globals.waitUI)//waiting for modal to open
	.verify.containsText('.form-button > span:nth-child(1)','CONFIRM RESERVATION')//asserting book button text
	.click('.form-button > span:nth-child(1)')//requesting
	.waitForElementVisible('p.success>span>span', browser.globals.waitUI)//waiting for status message to appear
	.verify.containsText('p.success>span>span','RESERVED FOR YOU')//asserting message
	.verify.containsText('.form-button > span:nth-child(1)','CANCEL RESERVATION')//asserting cancell button text
	.click('.form-button > span:nth-child(1)')//cancelling
	.waitForElementVisible('p.cancel>span>span', browser.globals.waitUI)//waiting for status message to appear
	.verify.containsText('p.cancel>span>span','CANCELLED FOR YOU')//asserting message
	.click('.modal-close')//closing modal
  },

    'Go to classes and book test MBO class': function (browser) { 
	browser
	.useXpath()	
	.waitForElementVisible("//span[text()='TransSerfing']",browser.globals.waitPOST)
	.click("//span[text()='TransSerfing']")
	.useCss()	
	.waitForElementVisible('.modal-open', browser.globals.waitUI)//waiting for modal to open
	.verify.containsText('.form-button > span:nth-child(1)','CONFIRM RESERVATION')//asserting book button text
	.click('.form-button > span:nth-child(1)')//requesting
	.waitForElementVisible('p.success>span>span', browser.globals.waitUI)//waiting for status message to appear
	.verify.containsText('p.success>span>span','RESERVED FOR YOU')//asserting message
	.verify.containsText('.form-button > span:nth-child(1)','CANCEL RESERVATION')//asserting cancell button text
	.click('.form-button > span:nth-child(1)')//cancelling
	.waitForElementVisible('p.cancel>span>span', browser.globals.waitUI)//waiting for status message to appear
	.verify.containsText('p.cancel>span>span','CANCELLED FOR YOU')//asserting message
	.click('.modal-close')//closing modal
	.end()
  }
};