module.exports = {
  tags: ['citySwitch','PC','widescreen'],
  'Open Home page': function (browser) {
    browser
      .url(browser.globals.baseUrl+'/?city=B')
      .waitForElementVisible('body', browser.globals.waitUI)
	  .windowMaximize()
  },
  'Switch the city and asert correct': function (browser) {
    browser
      .click('.b-main-slogan .chosen-container')
      .waitForElementVisible('.b-main-slogan .chosen-container .chosen-drop .chosen-results li', browser.globals.waitUI)
	  .useXpath()
	  .assert.containsText("//li[text()='München']","MÜNCHEN")
	  .useCss()
	  .click('li.active-result:nth-child(3)')
	  .waitForElementVisible('h2.ng-scope > div:nth-child(2) > a:nth-child(1) > span:nth-child(1)',browser.globals.waitUI)
	  .assert.containsText('h2.ng-scope > div:nth-child(2) > a:nth-child(1) > span:nth-child(1)','MÜNCHEN')
      .end();
  }
};
