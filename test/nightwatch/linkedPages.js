module.exports = {
  tags: ['citySwitch','BrowserParams','PC','widescreen'],

  'Open Home page': function (browser) {
    var params = browser.globals;
    browser
      .url(params.baseUrl+ '/?city=B')
      .waitForElementVisible('body', browser.globals.waitUI)
	  .windowMaximize()
  },
  'Switch the city and asert correct': function (browser) {
    var params = browser.globals;
    browser
	  .waitForElementVisible('.b-main-slogan h2 span:first-child', browser.globals.waitUI)
	  .verify.containsText('.b-main-slogan h2 span:first-child','BERLIN')
	  .url(params.baseUrl+ '/?city=M')
	  .waitForElementVisible('.b-main-slogan h2 span:first-child', browser.globals.waitUI)
	  .assert.containsText('.b-main-slogan h2 span:first-child','MÜNCHEN')
      .end();
  }
};
// describe('Given the Home Page, User', function() {

    // beforeEach(function() {
        // browser.get('/');
    // });

    // var params = browser.params;

    // browser.driver.manage().window().maximize();

    // it('should see title on the home page', function(done) {
        // var text = element(by.css('.b-main-slogan h2 span:first-child'));

        // expect(text.getText()).toBe('BERLIN');
        // done();
    // });

    // it('should see MÜNCHEN title on the MÜNCHEN Home Page', function(done) {
        // browser.executeScript('window.location = \"/?city=M\";');

        // var text = element(by.css('.b-main-slogan h2 span:first-child'));

        // expect(text.getText()).toBe('MÜNCHEN');
        // done();
    // });
// });
