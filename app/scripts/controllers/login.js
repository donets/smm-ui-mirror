'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Login', [])
    .controller('LoginCtrl', ['$rootScope', '$scope', '$http', 'ezfb', 'User', '$window', function ($rootScope, $scope, $http, ezfb, User, $window) {

        function sendLoginFB (res) {
            console.log(res);
            $http.get($window.smmConfig.restUrlBase + '/api/auth/login/facebook?accessToken=' + res.authResponse.accessToken).success(function (response) {
                console.log(response);
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

        User.get().$promise.then(function (res) {
            console.log(res);
            if (res.currentUser) {
                $scope.userName = res.currentUser.name;
            } else {
                updateLoginStatus();
            }
        });

        $scope.loginFB = function () {

            ezfb.login(function (res) {

                if (res.authResponse) {
                    updateLoginStatus();
                }
            }, {scope: 'email,user_likes'});

        };

        $scope.logout = function () {

            $http.get($window.smmConfig.restUrlBase + '/api/auth/logout').success(function (response) {
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
            console.log($scope.isPopupVisible);
            $http.get($window.smmConfig.restUrlBase + '/api/auth/login/password?email=' + this.emailLogin + '&password=' + this.passwordLogin).success(function (response) {
                console.log(response);
                $scope.loadingLogin = false;
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
