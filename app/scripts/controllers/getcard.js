'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:GetcardCtrl
 * @description
 * # GetcardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Getcard', [])
    .controller('GetcardCtrl', ['$scope', '$rootScope', '$http', 'parallaxHelper', 'navigator', '$window', function ($scope, $rootScope, $http, parallaxHelper, navigator, $window) {
        $scope.background = parallaxHelper.createAnimator(0.3, 50, 0, -$rootScope.windowHeight/2);
        $scope.fadeIn = parallaxHelper.createAnimator(-0.005, 1, 0, -$rootScope.windowHeight/1.2);
        if (navigator.platform() === 'Mac' && navigator.browser() === 'firefox') {
            $scope.hiddenFF = true;
        }
        $scope.subscribeCard = function (locate) {
            $scope.loadingSubscribe = true;
            $scope.successSubscribe = false;
            $scope.errorSubscribe = false;
            $http.post('//' + $window.smm_config.rest_url_old + '/api/subscribtion/subscribe', { email: $scope.email, interestedInProduct: true }).success(function () {
                $scope.loadingSubscribe = false;
                $scope.successSubscribe = true;
                $scope.email = '';
                $scope.form.$setPristine();
                $window.ga('send', 'submitemail_' + locate, 'card_page');
            }).error(function (response, status) {
                $scope.loadingSubscribe = false;
                $scope.errorSubscribe = true;
                $window.ga('send', 'submitemail_' + locate, 'card_page');
                console.error(status);
            });
        };
        $scope.addStudio = function () {
            var suggestedStudio = {
                email: 'noreply@somuchmore.org',
                message: 'A user suggest we should add studio: ' + $scope.studioName
            };
            $scope.loadingStudio = true;
            $http.post('//' + $window.smm_config.rest_url_old + '/api/message/', suggestedStudio).success(function () {
                $scope.loadingStudio = false;
                $scope.successStudio = true;
                $scope.studioName = '';
                $scope.form.$setPristine();
                $window.ga('send', 'studio_suggestion', 'card_page');
            }).error(function (response, status) {
                $scope.loadingStudio = false;
                $scope.errorStudio = true;
                console.error(status);
            });
        };
    }]);
