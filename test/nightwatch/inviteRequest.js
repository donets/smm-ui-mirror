//в этом тесте я не могу понять почему вызов метода mandrill в строках 55-80 не работает корректно, не выполняется даже логирующая функция в колбэке
//что забавно, что изолировано этот метод работает корректно и все выполняется как нужно, связано ли это с исполнением из ноды через найтвотч? не знаю...
var email1;
var mandrill = require('node-mandrill')('pZzwkxdsBErYobWGC6EJMQ');
module.exports = {
  tags: ['homepage','invite','email','mandrill','PC','widescreen'],
  
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
	var pregenerateduid=randomUuid();
	email1=pregenerateduid+params.signup.emailSuffix;
		
    browser
      .setValue('form[name="subscribeForm.header"] input[name="email"]',pregenerateduid+params.signup.emailSuffix )
      .setValue('form[name="subscribeForm.header"] input.zip', params.signup.zipCode)
	  .click('form[name="subscribeForm.header"] input[type=\'submit\']')
	  .waitForElementVisible('.subscribe-wrapper .form-response .form-success',2000)
	  .assert.elementPresent('.subscribe-wrapper .form-response .form-success')
	  .end();
  }/*,
  
  'Checking email': function (browser) {
   var result=true;
	var i=0;
	  
	  function sleep(time, callback) {
		var stop = new Date().getTime();
		while(new Date().getTime() < stop + time) {
			;
		}
		callback();
}
	  console.log(email1)
	  while (i < 50)
	  {
		if(!result) break;
		console.log('Going on iteration #'+i+' in waiting for mandrill email');
		sleep(5000,function()
		{
			console.log('Code executed in sleep');
			mandrill('/messages/search', {
				query: 'full_email:'+email1,
			},function(error, response)
			{
				console.log('Code executed');
				//uh oh, there was an error
				if (error)
				{				
					console.log('Code executed into first IF');
					browser.assert.equal(1, 2, 'Mandril threw an error:'+JSON.stringify(error));//this is for displaying error in test log
					result=false;//break;
					browser.end();
				}
				//everything's good, lets see what mandrill said
				else 
				{
					if(response.length>0) 
					{
						console.log('Code executed into second IF');
						browser.assert.equal(response.length,1,'There were more then one email sent');//check that only 1 email was sent
						browser.assert.equal(response[0].subject,'Danke fur Dein Interesse an Somuchmore!','Subject of email doesn\'t match the required');
						browser.assert.equal(1, 1, 'Email was accessible after'+i*5+'seconds');//this is for displaying success in test log
						result=false;//break;
						browser.end();
					}
				};
			});
			i++;
		});
		
	  };
  }*/
}
 
//    beforeEach(function() {
//        browser.get('/?city=M');
//    });
//
//    afterEach(function() {
//        browser.driver.manage().deleteAllCookies();
//    });
//
//    var params = browser.params,
//        waitForElem = params.helpers.waitForElem,
//        hasClass = params.helpers.hasClass,
//        waitForElemDisplayed = params.helpers.waitForElemDisplayed,
//        waitForElemPresent = params.helpers.waitForElemPresent,
//        myPassword = params.signup.password;
//
//    browser.driver.manage().window().maximize();
//
//    it('should be able to invite', function(done) {
//        browser.driver.executeAsyncScript(function(cb) {
//            var appElement = document.querySelector(".bolt-app");
//            angular.element(appElement).injector().get('myHttpInterceptor').enableLogRequests();
//            cb();
//        }).then(function() {
//            element(by.css('form[name="subscribeForm.header"] input[name="email"]')).sendKeys(params.signup.email);
//            element(by.css('form[name="subscribeForm.header"] input.zip')).sendKeys(params.signup.zipCode);
//            element(by.css('form[name="subscribeForm.header"] input[type="submit"]')).click();
//
//            browser.sleep(1000);
//
//            browser.driver.executeAsyncScript(function() {
//                var cb = arguments[arguments.length - 1];
//                var appElement = document.querySelector(".bolt-app");
//
//                function getUrlRequest() {
//                    if (appElement.injector) {
//                        cb(angular.element(appElement).injector().get('myHttpInterceptor').getRequest());
//                    } else {
//                        cb(angular.element(appElement).injector().get('myHttpInterceptor').getRequest());
//                    }
//                }
//                getUrlRequest();
//            }).then(function(result) {
//                expect(result[0].data.cityId).toMatch("2");
//                browser.driver.executeAsyncScript(function(cb) {
//                    var appElement = document.querySelector(".bolt-app");
//                    angular.element(appElement).injector().get('myHttpInterceptor').disableLogRequests();
//                    cb();
//                }).then(function() {
//                    done();
//                });
//            });
//        });
//    });
//});
