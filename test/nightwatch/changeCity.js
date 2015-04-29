module.exports = {
  tags: ['citySwitch','PC','widescreen'],

  'Open Home page': function (browser) {
    var params = browser.globals;
    browser
      .url(params.baseUrl)
      .waitForElementVisible('body', 1000)
	  .windowMaximize()
  },
  'Switch the city and asert correct': function (browser) {
    var params = browser.globals;
    browser
      .click('.b-main-slogan .chosen-container')
      .waitForElementVisible('.b-main-slogan .chosen-container .chosen-drop .chosen-results li', 1000)
	  .assert.containsText('li.active-result:nth-child(2)','MÜNCHEN')
	  .click('li.active-result:nth-child(2)')
	  .waitForElementVisible('h2.ng-scope > div:nth-child(2) > a:nth-child(1) > span:nth-child(1)',1000)
	  .assert.containsText('h2.ng-scope > div:nth-child(2) > a:nth-child(1) > span:nth-child(1)','MÜNCHEN')
      .end();
  }
};
