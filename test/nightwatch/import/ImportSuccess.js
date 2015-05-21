module.exports = {
  tags: ['login','import','upload','correct'],

  'LogIN': function (browser) {
    var params = browser.globals;
    browser
      .url(params.baseUrl + '/?city=L')
	  .waitForElementVisible('body', browser.globals.waitUI)
      .waitForElementVisible('.login-link > span:nth-child(1)', browser.globals.waitUI)
	  .assert.elementPresent('.login-link > span:nth-child(1)')
      .click('.login-link > span:nth-child(1)')
	  .assert.elementPresent('input[name=email]')
	  .assert.elementPresent('input[name=password]')
      .waitForElementVisible('input[name=email]', browser.globals.waitUI)
      .setValue('input[name=email]', params.admin.email)
      .setValue('input[name=password]', params.admin.password)
      .click('button[type=submit]')
	  .waitForElementVisible('#account', browser.globals.waitPOST)
      .assert.elementPresent('#account');
  },

  'Go to classes and initiate import': function (browser) {
     var path = require('path');
     var params = browser.globals;
      fileToUpload = '../../test_import_pass.csv',
      absolutePath = path.resolve(__dirname, fileToUpload);
	  //console.log(absolutePath);
    browser
      .url(params.baseUrl + '/admin/v2/classes/import/')
      .waitForElementVisible('.btn', browser.globals.waitPOST)
      .setValue('.btn',absolutePath)	  
	  .waitForElementVisible('tr.ng-scope:nth-child(1) > td:nth-child(2)',browser.globals.waitUI)
  },
  
    'Validate no error message present': function (browser) { 
	browser
	.assert.elementNotPresent('.ignored-columns')
	.getAttribute('.green', 'disabled', function(result) {this.assert.equal(result.value, null);})//asserting that all rows are OK and import button is enabled
	.end()
  }
};