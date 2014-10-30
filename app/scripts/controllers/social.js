'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SocialCtrl
 * @description
 * # SocialCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Social', [])
  .controller('SocialCtrl', ['$rootScope', '$scope', '$http', 'ezfb', '$window', function ($rootScope, $scope, $http, ezfb, $window) {

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

        function sendLoginData (res) {
            console.log(res);
            $http.get($window.smmConfig.restUrlBase + '/api/auth/login/facebook?accessToken=' + res.authResponse.accessToken).success(function (response) {
                console.log(response);
            }).error(function (response, status) {
                console.error(response);
                console.error(status);
            });
        }

        function updateLoginStatus (more) {
            ezfb.getLoginStatus(function (res) {
                $scope.loginStatus = res;
                if (res.authResponse) {
                    sendLoginData(res);
                }
                (more || angular.noop)();
            });
        }

        function updateApiMe () {
            ezfb.api('/me', function (res) {
                $scope.apiMe = res;
                console.log(res);
            });
        }

        updateLoginStatus(updateApiMe);

        $scope.login = function () {
            /**
             * Calling FB.login with required permissions specified
             * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
             */
            ezfb.login(function (res) {
                /**
                 * no manual $scope.$apply, I got that handled
                 */
                if (res.authResponse) {
                    updateLoginStatus(updateApiMe);
                }
            }, {scope: 'email,user_likes'});
        };

        $scope.logout = function () {
            /**
             * Calling FB.logout
             * https://developers.facebook.com/docs/reference/javascript/FB.logout
             */
            ezfb.logout(function () {
                updateLoginStatus(updateApiMe);
            });
        };

  }]);
