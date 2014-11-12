'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the boltApp
 */

angular.module('boltApp.controllers.About', [])
    .controller('AboutCtrl', [ '$scope', '$http', '$window', function ($scope, $http, $window) {
        $scope.subscribeCard = function (locate) {
            $scope.loadingSubscribe = true;
            $scope.successSubscribe = false;
            $scope.errorSubscribe = false;
            $http.post($window.smmConfig.restUrlBaseOld + '/api/subscribtion/subscribe', { email: $scope.email, interestedInProduct: true }).success(function () {
                $scope.loadingSubscribe = false;
                $scope.successSubscribe = true;
                $scope.email = '';
                $scope.subscribeForm.$setPristine();
                $window.ga('send', 'event', 'about_page', 'submitemail_' + locate);
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
            $http.post($window.smmConfig.restUrlBaseOld + '/api/message/', feedback).success(function () {
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
