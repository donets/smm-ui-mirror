//'use strict';
//
//describe('Given invite form, User', function() {
//
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
