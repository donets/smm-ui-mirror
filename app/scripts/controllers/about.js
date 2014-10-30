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
                $scope.form.$setPristine();
                $window.ga('send', 'submitemail_' + locate, 'about_page');
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
                $scope.form.$setPristine();
                $window.ga('send', 'about_question', 'about_page');
            }).error(function (response, status) {
                $scope.loadingFeedback = false;
                $scope.errorFeedback = true;
                console.error(status);
            });
        };
        $scope.sendFeedback = function (message) {
            $scope.receiveFeedback = true;
            return message === 'yes' ? $window.ga('send', 'smm_clear', 'about_page') : $window.ga('send', 'smm_not_clear', 'about_page');
        };
    }]);
