module.exports = {
  tags: ['homepage','links','PC','widescreen'],
 beforeEach : function(browser) {
    var params = browser.globals;
    browser
      .url(params.baseUrl+'/?city=B')
      .waitForElementVisible('body', 1000)
	  .windowMaximize()
  },
 

  /*'Check kurses link on page': function (browser) {
    var params = browser.globals;
    browser
	  .verify.containsText('#highligt > div:nth-child(1) > a:nth-child(4) > span:nth-child(1)','Hier geht es zum Angebot')
      .click('#highligt > div:nth-child(1) > a:nth-child(4) > span:nth-child(1)')
	  .waitForElementVisible('h1 > span.ng-scope',3000,false,undefined,'Page must be opened in same window')
      .verify.containsText('.dashboard-title > div:nth-child(1) > h1:nth-child(1) > span:nth-child(1)', 'Finde einen Kurs')
  },*/

  'Check FAQ link on page': function (browser) {
    browser
	  .verify.containsText('.faq-link > span:nth-child(1)','Weitere Fragen? Hier geht es zu den FAQ')
      .click('.faq-link > span:nth-child(1)')
	  .waitForElementVisible('.faq__article > h1:nth-child(1)',3000,false,undefined,'Page must be opened in same window')
      .verify.containsText('.faq__article > h1:nth-child(1)', 'Guide to Somuchmore')
  },

  'Check AboutUS link on bottom': function (browser) {
    browser
	  .assert.containsText('.b-footer-nav__menu > li:nth-child(1) > a:nth-child(1) > span:nth-child(1)','Über uns')
      .click('.b-footer-nav__menu > li:nth-child(1) > a:nth-child(1) > span:nth-child(1)')
	  .waitForElementVisible('.b-main-slogan > h2:nth-child(1) > span:nth-child(1)',3000,false,undefined,'Page must be opened in same window')
      .verify.containsText('.b-main-slogan > h2:nth-child(1) > span:nth-child(1)', 'ENTDECKE')
  },

  'Check Impressum link on bottom': function (browser) {
    browser
	  .assert.containsText('.b-footer-nav__menu > li:nth-child(2) > a:nth-child(1) > span:nth-child(1)','Impressum')
      .click('.b-footer-nav__menu > li:nth-child(2) > a:nth-child(1) > span:nth-child(1)')
	  .waitForElementVisible('.b-main-slogan > h2:nth-child(1) > span:nth-child(1)',3000,false,undefined,'Page must be opened in same window')
      .verify.containsText('.b-main-slogan > h2:nth-child(1) > span:nth-child(1)', 'IMPRESSUM')
  },

  'Check AGB link on bottom': function (browser) {
    browser
	  .assert.containsText('.b-footer-nav__menu > li:nth-child(3) > a:nth-child(1) > span:nth-child(1)','AGB')
      .click('.b-footer-nav__menu > li:nth-child(3) > a:nth-child(1) > span:nth-child(1)')
	  .waitForElementVisible('.b-main-slogan > h2:nth-child(1) > span:nth-child(1)',3000,false,undefined,'Page must be opened in same window')
      .verify.containsText('.b-main-slogan > h2:nth-child(1) > span:nth-child(1)', 'ALLGEMEINE')
  },

  'Check FAQ link on bottom': function (browser) {
    browser
	  .assert.containsText('.b-footer-nav__menu > li:nth-child(4) > a:nth-child(1) > span:nth-child(1)','FAQ')
      .click('.b-footer-nav__menu > li:nth-child(4) > a:nth-child(1) > span:nth-child(1)')
	  .waitForElementVisible('.faq__article > h1:nth-child(1)',3000,false,undefined,'Page must be opened in same window')
      .verify.containsText('.faq__article > h1:nth-child(1)', 'Guide to Somuchmore')
	  .end()
  }
};
    /*'Check kurses link on page': function (browser) {
    var params = browser.globals;
    browser
	  .assert.containsText('#highligt > div:nth-child(1) > a:nth-child(4) > span:nth-child(1)','Hier geht es zum Angebot')
      .click('#highligt > div:nth-child(1) > a:nth-child(4) > span:nth-child(1)')//new window opens here
	  .pause(3000)//waiting for window to open
	  .window_handles(function(result) { //switching to new window
		 
		 browser.assert.equal(result.value.length, 2, 'Link have to be opened in new window')
		 browser.switchWindow(result.value[1]);
	   })
      .waitForElementVisible('h1 > span.ng-scope', 5000)
      .assert.containsText('h1 > span.ng-scope', 'Finde einen Kurs')
	  .window_handles(function(result) { //closing new window 
		 browser
			 .closeWindow(result.value[0])
	   })
	  .window_handles(function(result) { //switching back to main window
		 browser.switchWindow(result.value[0]);
	   })

  }*/
