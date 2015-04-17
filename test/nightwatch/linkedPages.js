module.exports = {
  tags: ['citySwitch','BrowserParams','PC','widescreen'],

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
	  .verify.containsText('.b-main-slogan h2 span:first-child','BERLIN')
	  .execute('window.location = \"/?city=M\";')
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
