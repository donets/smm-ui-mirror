'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the boltApp
 */

angular.module('boltApp.controllers.About', [])
    .controller('AboutCtrl', [ '$scope', '$rootScope', '$http', '$window', '$cookieStore', function ($scope, $rootScope, $http, $window, $cookieStore) {
        $scope.subscribeCard = function (locate) {
            $scope.loadingSubscribe = true;
            $scope.successSubscribe = false;
            $scope.errorSubscribe = false;
            $http.post($window.smmConfig.restUrlBase + '/api/rest/invitations', { email: $scope.email, interestedInProduct: true, lang: $rootScope.lang, landingUrl: $cookieStore.get('landingUrl') }).success(function () {
                $scope.loadingSubscribe = false;
                $scope.successSubscribe = true;
                $scope.email = '';
                $scope.subscribeForm.$setPristine();
                $window.ga('send', 'event', 'Invitations', 'onSubscribe', locate);
                $.getScript('//www.googleadservices.com/pagead/conversion_async.js').done( function() {
                    $window.google_trackConversion({
                        google_conversion_id: 970072239,
                        google_conversion_language: 'de',
                        google_conversion_format: '3',
                        google_conversion_color: 'ffffff',
                        google_conversion_label: 'fiXPCMmi_wkQr8HIzgM',
                        google_remarketing_only: false
                    });
                    $window.google_trackConversion({
                        google_conversion_id: 968958845,
                        google_conversion_language: 'de',
                        google_conversion_format: '3',
                        google_conversion_color: 'ffffff',
                        google_conversion_label: 'GgJECOPfhgsQ_caEzgM',
                        google_remarketing_only: false
                    });
                });
                $.getScript('//connect.facebook.net/en_US/fbds.js').done( function() {
                    $window._fbq = $window._fbq || [];
                    $window._fbq.push(['track', '6021957047725', {'value': '0.00','currency': 'EUR'}]);
                });
            }).error(function (response, status) {
                $scope.loadingSubscribe = false;
                $scope.errorSubscribe = true;
                console.error(status);
            });
        };
        $scope.sendMessage = function () {
            var feedback = {
                email: $scope.email,
                message: $scope.feedback
            };
            $scope.loadingFeedback = true;
            $http.post($window.smmConfig.restUrlBase + '/api/message', feedback).success(function () {
                $scope.loadingFeedback = false;
                $scope.successFeedback = true;
                $scope.feedback = '';
                $scope.feedbackForm.$setPristine();
                $window.ga('send', 'event', 'about_page', 'about_question');
            }).error(function (response, status) {
                $scope.loadingFeedback = false;
                $scope.errorFeedback = true;
                console.error(status);
            });
        };
        $scope.sendFeedback = function (message) {
            $scope.receiveFeedback = true;
            return message === 'yes' ? $window.ga('send', 'event', 'about_page', 'smm_clear') : $window.ga('send', 'event', 'about_page', 'smm_not_clear');
        };
    }]);
