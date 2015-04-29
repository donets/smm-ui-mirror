module.exports = {
  tags: ['login'],

  'Fill the credentials': function (browser) {
    var params = browser.globals;
    browser
      .url(params.baseUrl)
      .waitForElementVisible('body', 1000)
      .click('a.login-link.ng-scope > span.ng-scope')
      .waitForElementVisible('input[name=email]', 1000)
      .setValue('input[name=email]', params.signup.email)
      .setValue('input[name=password]', params.signup.password);
  },

  'Submit and check': function (browser) {
    var params = browser.globals;
    browser
      .click('button[type=submit]')
      .waitForElementVisible('h1 > span.ng-scope', 5000)
      .assert.containsText('h1 > span.ng-scope', 'Finde einen Kurs')
      .end();
  }
};
