module.exports = {
  tags: ['homepage','invite','PC','widescreen'],

  'Open Home page': function (browser) {
    var params = browser.globals;
    browser
      .url(params.baseUrl + '/?city=L')
      .waitForElementVisible('body', browser.globals.waitUI)
	  .windowMaximize()
  },
  'Inviting someone': function (browser) {
    var params = browser.globals;
	var randomUuid = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    browser
	  .waitForElementVisible('h2.ng-scope > span:nth-child(4) > span:nth-child(1)',browser.globals.waitUI)
	  .assert.containsText('h2.ng-scope > span:nth-child(4) > span:nth-child(1)','IS YOUR STUDIO')
      .end();
  }
};


// describe('Given an invite form, User', function() {

    // beforeEach(function() {
        // browser.get('/');
    // });

    // var params = browser.params;

    // browser.driver.manage().window().maximize();

    // it('should be able to invite someone', function(done) {
        // var email = element(by.css('form[name="subscribeForm.header"] input[name="email"]'));
        // var zipCode = element(by.css('form[name="subscribeForm.header"] input.zip'));
        // var formButton = element(by.css('form[name="subscribeForm.header"] input[type=\'submit\']'));
        // var successMessage = element.all(by.css('.subscribe-wrapper .form-response .form-success')).first();

        // email.sendKeys(params.signup.email);
        // zipCode.sendKeys(params.signup.zipCode);
        // formButton.click();

        // expect(successMessage.isDisplayed()).toBe(true);
        // done();
    // });
// });
