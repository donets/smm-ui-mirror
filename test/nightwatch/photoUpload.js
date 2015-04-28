// it is not working with phantomJS i don't know why but phantomJS just loops in itself without any errors
module.exports = {
  tags: ['login','image','upload'],

  'LogIN': function (browser) {
    var params = browser.globals;
    browser
      .url(params.baseUrl)
      .windowMaximize()
      .waitForElementVisible('body', 1000)
      .click('a.login-link.ng-scope > span.ng-scope')
      .waitForElementVisible('input[name=email]', 1000)
      .setValue('input[name=email]', params.signup.email)
      .setValue('input[name=password]', params.signup.password)
      .click('button[type=submit]')
      .waitForElementVisible('h1 > span.ng-scope', 5000)
      .assert.containsText('h1 > span.ng-scope', 'Finde einen Kurs')
  },

  'Go to my account and upload photo': function (browser) {
     var path = require('path');
     var params = browser.globals;
      fileToUpload = '../../app/images/alexandra.jpg',
      absolutePath = path.resolve(__dirname, fileToUpload);
    browser
      .url(params.baseUrl + '/my/account/')
      .waitForElementVisible('.profile-title > h2:nth-child(1) > span:nth-child(1)', 5000)
      .assert.containsText('.profile-title > h2:nth-child(1) > span:nth-child(1)', 'Hallo,')
      .click('.tab-nav > li:nth-child(1) > a:nth-child(1)')
      .waitForElementVisible('div.env-upload-box > div',2000)
      .click('div.env-upload-box > div')
      .execute('$(\'.button_upload input\').css("visibility", "visible");')
      .setValue('.button_upload input',absolutePath)
      .click('.action .upload_button')
      .waitForElementNotVisible('div.modal-dialog',10000)
      .end();//add assertion of image for complete test
  }
};
