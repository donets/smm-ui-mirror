module.exports = {
  tags: ['login','import','upload'],

  'LogIN': function (browser) {
    var params = browser.globals;
    browser
      .url(params.baseUrl + '/?city=L')
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

  'Go to my account and upload photo': function (browser) {
     var path = require('path');
     var params = browser.globals;
      fileToUpload = '../../test/test_import.csv',
      absolutePath = path.resolve(__dirname, fileToUpload);
	  console.log(absolutePath);
    browser
      .url(params.baseUrl + '/admin/v2/classes/import/')
      .waitForElementVisible('.btn', browser.globals.waitPOST)
	  .execute('$(\'.btn\').click(function(e){e.preventDefault();});')
	  //.execute('$(\'.btn\').click()')
      .setValue('.btn',absolutePath)
	  //.fireEvent('change')
	  .execute('$(\'.btn\').change()')
      //.waitForElementNotVisible('div.modal-dialog',browser.globals.waitPOST)
      .end();//add assertion of image for complete test
  }
};