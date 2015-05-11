'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SubscribeCtrl
 * @description
 * # SubscribeCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Subscribe', [])
    .controller('SubscribeCtrl', [ '$scope', '$rootScope', '$window', '$http', '$cookieStore', function ($scope, $rootScope, $window, $http, $cookieStore) {

        $scope.subscribe = function() {
            $scope.loadingUpdate = true;
            $scope.successUpdate = false;
            $scope.errorUpdate = false;
            var newsletter = {
                email: $scope.email,
                newsletter: true,
                landingUrl: $cookieStore.get('landingUrl'),
                lang: $rootScope.lang,
                cityId: $rootScope.currentCity.id
            };
            $http.post($window.smmConfig.restUrlBase + '/api/rest/invitations', newsletter).success(function () {
                $scope.loadingUpdate = false;
                $scope.successUpdate = true;
                $scope.email = '';
                $scope.form.$setPristine();
                $window.ga('set', 'dimension1', '1');
                $window.ga('send', 'event', 'content', 'signup_app_waitlist');
            }).error(function (response, status) {
                $scope.loadingUpdate = false;
                $scope.errorUpdate = true;
                console.error(status);
            });
        };

    }]);
