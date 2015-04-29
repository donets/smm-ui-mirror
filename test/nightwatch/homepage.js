module.exports = {
  tags: ['homepage','invite','PC','widescreen'],

  'Open Home page': function (browser) {
    var params = browser.globals;
    browser
      .url(params.baseUrl)
      .waitForElementVisible('body', 1000)
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
      .setValue('form[name="subscribeForm.header"] input[name="email"]',randomUuid()+params.signup.emailSuffix )
      .setValue('form[name="subscribeForm.header"] input.zip', params.signup.zipCode)
	  .click('form[name="subscribeForm.header"] input[type=\'submit\']')
	  .waitForElementVisible('.subscribe-wrapper .form-response .form-success',2000)
	  .assert.elementPresent('.subscribe-wrapper .form-response .form-success')
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
