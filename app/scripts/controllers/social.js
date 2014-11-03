'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SocialCtrl
 * @description
 * # SocialCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Social', [])
  .controller('SocialCtrl', ['$rootScope', '$scope', '$http', 'ezfb', 'session', '$window', function ($rootScope, $scope, $http, ezfb, session, $window) {

        $scope.getLikes = function () {

            return $http.get('//graph.facebook.com/somuchmoredeutsch', {cache: false}).success(function (res) {

                $rootScope.likes = res.likes;

            });

        };

        $scope.getLikes();

        ezfb.Event.subscribe('edge.create', function(targetUrl) {
            $window.ga('set', 'dimension3', '1');
            $window.ga('send', 'social', 'facebook', 'like', targetUrl);
            $scope.getLikes();
        });

        ezfb.Event.subscribe('edge.remove', function(targetUrl) {
            $window.ga('set', 'dimension3', '0');
            $window.ga('send', 'social', 'facebook', 'unlike', targetUrl);
            $scope.getLikes();
        });

        function sendLoginFB (res) {
            console.log(res);
            $http.get('/api/auth/login/facebook?accessToken=' + res.authResponse.accessToken).success(function (response) {
                console.log(response);
                $scope.isPopupVisible = false;
                $scope.userName = response.user.name;
            }).error(function (response, status) {
                console.error(response);
                console.error(status);
            });
        }

        function updateLoginStatus (more) {
            ezfb.getLoginStatus(function (res) {
                $scope.loginStatus = res;
                if (res.authResponse) {
                    sendLoginFB(res);
                }
                (more || angular.noop)();
            });
        }

        console.log(session);

        if(!_.isEmpty(session)) {
            var now = moment();
            var valid = moment(+session['u.valid']);
            return valid.diff(now) > 0 ? $scope.userName = session['u.name'] : $scope.userName = null;
        } else {
            updateLoginStatus();
        }

        $scope.loginFB = function () {

            ezfb.login(function (res) {

                if (res.authResponse) {
                    updateLoginStatus();
                }
            }, {scope: 'email,user_likes'});

        };

        $scope.logout = function () {

            $http.get('/api/auth/logout').success(function (response) {
                console.log(response);
                $scope.userName = null;
            }).error(function (response, status) {
                console.error(response);
                console.error(status);
            });

        };

        $scope.forgotView = false;

        $scope.toggleForgot = function () {
            $scope.forgotView = !$scope.forgotView;
        };

        $scope.login = function () {
            $scope.loadingLogin = true;
            $scope.errorLogin = false;
            $http.get('/api/auth/login/password?email=' + this.emailLogin + '&password=' + this.passwordLogin).success(function (response) {
                console.log(response);
                $scope.loadingLogin = false;
                $scope.isPopupVisible = false;
                $scope.userName = response.user.name;
            }).error(function (response, status) {
                console.error(response);
                console.error(status);
                $scope.loadingLogin = false;
                $scope.errorLogin = true;
            });
        };

        $scope.forgot = function () {
            $scope.loadingForgot = true;
            $scope.successSubscribe = false;
            $scope.errorForgot = false;
            $http.get($window.smmConfig.restUrlBase + '/api/auth/requestPwdReset?email=' + this.emailForgot).success(function (response) {
                console.log(response);
                $scope.loadingForgot = false;
                $scope.successSubscribe = true;
            }).error(function (response, status) {
                console.error(response);
                console.error(status);
                $scope.loadingForgot = false;
                $scope.errorForgot = true;
            });
        };

  }]);
