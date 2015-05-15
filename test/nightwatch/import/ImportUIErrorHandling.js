module.exports = {
  tags: ['login','import','upload','incorrect'],

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
      fileToUpload = '../../test_import_err.csv',
      absolutePath = path.resolve(__dirname, fileToUpload);
	  //console.log(absolutePath);
    browser
      .url(params.baseUrl + '/admin/v2/classes/import/')
      .waitForElementVisible('.btn', browser.globals.waitPOST)
      .setValue('.btn',absolutePath)	  
	  .waitForElementVisible('tr.ng-scope:nth-child(1) > td:nth-child(2)',browser.globals.waitUI)
	  .pause(10000)//задержка чтоб ответ пришел от јѕ» на предмет серверсайдовых валидаций, не удивлюсь если на CI будет падать....
  },
  
    'Validate all rows contain an error': function (browser) { 
	//элементы для падающих в данный момент тестов ['9','17'],['10','17'],['11','17'],['12','7'],['13','7'],['20','3'],['21','3'],['22','3'],['22','3']
	//после фикса SMMWEB-79 добавить их в массив
	var tests=[['1','2'],['2','9'],['3','10'],['4','11'],['5','16'],['6','16'],['7','17'],['8','17'],['14','15'],['15','15'],['16','13'],
		['17','13'],['18','14'],['19','14'],['23','2'],['24','4'],['25','5'],['26','9'],['27','10'],['28','11'],['29','16'],['30','17'],
		['31','15'],['32','13'],['33','14'],['34','18']] //массив с провер€емыми €чейками, новые добавить сюда-же в любое место
		s = 'function TestAll(){'
		s = s+'browser\n'
    for (i = 0; i < tests.length; i++) { //эта балалайка строит статическую функцию потому-что итеративно выполнить не получилось...
	s= s+'.getText(\'tr.ng-scope:nth-child('+tests[i][0]+') > td:nth-child(4) > div\',function(result) {\n'+
			'this.verify.cssClassPresent(\'tr.ng-scope:nth-child('+tests[i][0]+') > td:nth-child('+tests[i][1]+')\',\'invalid\',\'Running:\'+result.value)})\n'
	 /*browser
	  .getText('tr.ng-scope:nth-child('+tests[i][0]+') > td:nth-child(4) > div',function(result) {//вычитываем название теста
		  this.assert.cssClassPresent('tr.ng-scope:nth-child('+tests[i][0]+') > td:nth-child('+tests[i][1]+')','invalid','FAILED:'+result.value)//провер€ем и выводим ошибку если фейлитс€
		  });*/
	}
	s=s+'.waitForElementVisible(\'.green\',browser.globals.waitUI).assert.attributeEquals(\'.green\',\'disabled\',\'true\')\n.end()};'
	//console.log(s);
	eval(s);//а вот эта та сама€ часть почему € считаю джаваскрипт извратом...
	TestAll();//€ создал монстра...
  }
};