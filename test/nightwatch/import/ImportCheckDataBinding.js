module.exports = {
  tags: ['login','import','upload','correct'],

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

  'Go to classes and initiate import': function (browser) {
     var path = require('path');
     var params = browser.globals;
      fileToUpload = '../../test_import_data.csv',
      absolutePath = path.resolve(__dirname, fileToUpload);
	  //console.log(absolutePath);
    browser
      .url(params.baseUrl + '/admin/v2/classes/import/')
      .waitForElementVisible('.btn', browser.globals.waitPOST)
      .setValue('.btn',absolutePath)	  
	  .waitForElementVisible('tr.ng-scope:nth-child(1) > td:nth-child(2)',browser.globals.waitUI)
  },
  
    'Validate no error message present and ': function (browser) { 
	browser
	.getAttribute('.green', 'disabled', function(result) {this.assert.equal(result.value, null);})//asserting that all rows are OK and import button is enabled
	.click('.green')
	.waitForElementVisible('.modal-content',browser.globals.waitUI)
	.waitForElementVisible('.form-button',browser.globals.waitImport,true,function(){
		var params = browser.globals;
		var assert = this.assert;//passing node assert to this level
		
		var RESTClient = require('node-rest-client').Client;
		var RESTclient = new RESTClient();
		var args = {
		  data: { "cityId":4,"locationId":"27452"},
		  headers:{"Content-Type": "application/json"} 
		};

		RESTclient.post("https://stage-smm-api.herokuapp.com/api/classes/get/all", args, function(data,response) {
			assert.equal(data.status,"success",data.messages);
			assert.equal(data.classes.occurenceAccesses.length,48);
			assert.equal(data.classes.classAccesses.length,48);
			for (i = 0; i < data.classes.classAccesses.length; i++) {
				assert.equal(data.classes.classAccesses[i].title.indexOf("test#005")>-1,true,'PASSED:'+data.classes.classAccesses[i].title);
			}
		});
	  })//тут очень долго можно ждать ставлю 300 секунд 
	.pause(3000, function(){		
		var pg = require('pg');
		var client = new pg.Client(browser.globals.conString);
		client.connect(function(err, client, done) {
		  if(err) {
			return console.error('error fetching client from pool', err);
		  }
		  client.query('DELETE FROM occurrence WHERE parentevent_id between 900005 and 900212', function(err, result) {
			console.log('removed '+result.rowCount+' records from event_occurrence');
			client.query('DELETE FROM event WHERE id between 900005 and 900212', function(err, result) {
				console.log('removed '+result.rowCount+' records from event');
				client.end();
			});
		  })
		});})//pause to sync callback function execution from previous lines
	.pause(3000)//pause to sync SQL function execution from previous lines
	.end()
  }
};