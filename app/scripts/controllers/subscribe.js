'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SubscribeCtrl
 * @description
 * # SubscribeCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Subscribe', [])
    .controller('SubscribeCtrl', [ '$scope', '$window', '$http', function ($scope, $window, $http) {

        $scope.subscribe = function() {
            $scope.loadingUpdate = true;
            $scope.successUpdate = false; 
            $scope.errorUpdate = false;
            $http.post($window.smmConfig.restUrlBaseOld + '/api/subscribtion/subscribe', { email: $scope.email }).success(function () {
                $scope.loadingUpdate = false;
                $scope.successUpdate = true;
                $scope.email = '';
                $scope.form.$setPristine();
                /* jshint ignore:start */
                $window.ga('set', 'dimension1', '1');
                $window.ga('send', 'event', 'content', 'signup_app_waitlist');
                $.getScript("//www.googleadservices.com/pagead/conversion_async.js").done( function() {
                    $window.google_trackConversion({
                        google_conversion_id: 970072239,
                        google_conversion_language: "de",
                        google_conversion_format: "3",
                        google_conversion_color: "ffffff",
                        google_conversion_label: 'fiXPCMmi_wkQr8HIzgM',
                        google_remarketing_only: false
                    });
                    $window.google_trackConversion({
                        google_conversion_id: 968958845,
                        google_conversion_language: "de",
                        google_conversion_format: "3",
                        google_conversion_color: "ffffff",
                        google_conversion_label: 'GgJECOPfhgsQ_caEzgM',
                        google_remarketing_only: false
                    });
                });
                /* jshint ignore:end */
            }).error(function (response, status) {
                $scope.loadingUpdate = false;
                $scope.errorUpdate = true;
                console.error(status);
            });
        };

    }]);
