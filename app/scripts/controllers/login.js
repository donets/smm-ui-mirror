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
                $rootScope.userName = response.user.name;
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

        var checkUser = function () {
            User.get().$promise.then(function (response) {
                console.log(response);
                if (response.currentUser) {
                    $rootScope.userName = response.currentUser.name;
                    $rootScope.roleMember = _.include(response.currentUser.roles, 'member') ? true : false;
                    $rootScope.roleAdmin = _.include(response.currentUser.roles, 'admin') ? true : false;
                } else {
                    $rootScope.userName = null;
                    $rootScope.roleMember = null;
                    $rootScope.roleAdmin = null;
                }
            });
        };

        if ($rootScope.$state.current.name !== 'login') {
            checkUser();
        }

        $scope.loginFB = function () {

            ezfb.login(function (res) {

                if (res.authResponse) {
                    updateLoginStatus($rootScope.$state.go('profile.membership'));
                }

            }, {scope: 'email,user_likes'});

        };

        $scope.logout = function () {

            $http.get($window.smmConfig.restUrlBase + '/api/auth/logout').success(function (response) {
                console.log(response);
                $rootScope.userName = null;
                $rootScope.roleMember = null;
                $rootScope.roleAdmin = null;
                $rootScope.$state.go('home');
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
                $rootScope.userName = response.user.name;
                $rootScope.roleMember = _.include(response.user.roles, 'member') ? true : false;
                $rootScope.roleAdmin = _.include(response.user.roles, 'admin') ? true : false;
                $rootScope.$state.go('profile.membership');
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
