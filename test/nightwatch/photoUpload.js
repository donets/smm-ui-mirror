// it is not working with phantomJS i don't know why but phantomJS just loops in itself without any errors
module.exports = {
  tags: ['login','image','upload'],

  'LogIN': function (browser) {
    var params = browser.globals;
    browser
      .url(params.baseUrl + '/?city=L')
      .waitForElementVisible('body', browser.globals.waitUI)
	  .assert.elementPresent('.login-link > span:nth-child(1)')
      .click('.login-link > span:nth-child(1)')
	  .assert.elementPresent('input[name=email]')
	  .assert.elementPresent('input[name=password]')
      .waitForElementVisible('input[name=email]', browser.globals.waitUI)
      .setValue('input[name=email]', params.signup.email)
      .setValue('input[name=password]', params.signup.password)
      .click('button[type=submit]')
	  .waitForElementVisible('#account', browser.globals.waitPOST)
      .assert.elementPresent('#account');
  },

  'Go to my account and upload photo': function (browser) {
     var path = require('path');
     var params = browser.globals;
      fileToUpload = '../../app/images/alexandra.jpg',
      absolutePath = path.resolve(__dirname, fileToUpload);
    browser
      .url(params.baseUrl + '/my/account/')
      .waitForElementVisible('.profile-title > h2:nth-child(1) > span:nth-child(1)', browser.globals.waitPOST)
      .assert.containsText('.profile-title > h2:nth-child(1) > span:nth-child(1)', 'Hello')
      .click('.tab-nav > li:nth-child(1) > a:nth-child(1)')
      .waitForElementVisible('div.env-upload-box > div',browser.globals.waitUI)
      .click('div.env-upload-box > div')
      .execute('$(\'.button_upload input\').css("visibility", "visible");')
      .setValue('.button_upload input',absolutePath)
      .click('.action .upload_button')
      .waitForElementNotVisible('div.modal-dialog',browser.globals.waitImport)
      .end();//add assertion of image for complete test
  }
};
