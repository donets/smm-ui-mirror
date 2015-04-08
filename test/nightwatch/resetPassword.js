  module.exports = {
  tags: ['resetPassword'],

  'reset password for test@somuchmore.org': function (browser) {
	  var params = browser.globals;
  browser
    .url(params.baseUrl)
    .waitForElementVisible('body', 1000)
    .click('a.login-link.ng-scope > span.ng-scope')
    .waitForElementVisible('.b-header-nav_login-widget',1000)
    .waitForElementVisible('a.forgot-password:nth-child(1) > span:nth-child(1)',1000)
    .click('a.forgot-password:nth-child(1) > span:nth-child(1)')
    .waitForElementVisible('input[ng-model=emailForgot]',1000)
    .setValue('input[ng-model=emailForgot]',params.signup.email)
    .click('div.form-rel > button[ng-disabled=loadingForgot]')
    .waitForElementVisible('div[ng-show=successSubscribe] > span',3000)
    .assert.containsText('div[ng-show=successSubscribe] > span','E-Mail')
    .end()
  }
}
//        browser.get('http://shitmail.me/mail/inbox/somuchmore@shitmail.me');
//        var btn = element(by.cssContainingText('a', 'Passwort reset request'));
//        btn.click();
//
//        browser.driver.executeScript(function() {
//            return document.querySelectorAll('.boxContent')[1].innerText.match('https.*')[0];
//        }).then(function(result) {
//            browser.get(result);
//        });
//
//        var resetPage = element(by.css('.b-main-slogan'));
//        expect(browser.getCurrentUrl()).toContain('/p/password');
//
//        element(by.css('form.b-card-subscribe input[type="password"]')).sendKeys(params.signup.password);
//        element(by.css('form.b-card-subscribe button[type="submit"]')).click();

