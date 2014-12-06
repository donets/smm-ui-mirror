'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:GetcardCtrl
 * @description
 * # GetcardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Getcard', [])
    .controller('GetcardCtrl', ['$scope', '$rootScope', '$http', 'parallaxHelper', 'getStudios', '$window', '$modal', function ($scope, $rootScope, $http, parallaxHelper, getStudios, $window, $modal) {
        $scope.background = parallaxHelper.createAnimator(0.3, 50, 0, -$rootScope.windowHeight/2);
        $scope.fadeIn = parallaxHelper.createAnimator(-0.005, 1, 0, -$rootScope.windowHeight/1.2);
        $scope.subscribeCard = function (locate) {
            $scope.loadingSubscribe = true;
            $scope.successSubscribe = false;
            $scope.errorSubscribe = false;
            $http.post($window.smmConfig.restUrlBase + '/api/rest/invitations', { email: $scope.email, interestedInProduct: true }).success(function () {
                $scope.loadingSubscribe = false;
                $scope.successSubscribe = true;
                $scope.email = '';
                $scope.subscribeForm.$setPristine();
                $window.ga('send', 'event', 'card_page', 'submitemail_' + locate);
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
        $scope.studios = getStudios.data;

        $scope.suggestStudio = function () {
            $modal.open({
                templateUrl: 'views/modalSuggest.html',
                controller: ['$scope', '$modalInstance', '$http',

                    function ($scope, $modalInstance, $http) {

                        $scope.suggest = {};

                        $scope.addStudio = function () {
                            console.log($scope.suggest);
                            var suggestedStudio = {
                                email: $scope.suggest.userEmail || 'noreply@somuchmore.org',
                                message: 'A user ' + ($scope.suggest.userName + ' ' || '') + 'suggest we should add studio: ' + $scope.suggest.studioName
                            };
                            $scope.loadingStudio = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/message/', suggestedStudio).success(function () {
                                $scope.loadingStudio = false;
                                $scope.successStudio = true;
                                $window.ga('send', 'event', 'card_page', 'studio_suggestion');
                                setTimeout(function () {
                                    $modalInstance.dismiss();
                                }, 200);
                            }).error(function (response, status) {
                                $scope.loadingStudio = false;
                                $scope.errorStudio = true;
                                console.error(status);
                            });
                        };

                        $scope.close = function () {
                            $modalInstance.close(true);
                        };

                    }],
                backdrop: 'static',
                windowClass: 'modal-suggest'
            });
        };

        $scope.slides = [
            {
                image: '/images/static/fact_01-' + $rootScope.resolution + '.jpg',
                title: 'Meditation kann Dir die Gehirnkapazität eines 25-jährigen erhalten.',
                text: '— NCBI (National Center for Biotechnology Information)'
            }, {
                image: '/images/static/fact_02-' + $rootScope.resolution + '.jpg',
                title: 'Yoga kann schon nach 3 Monaten Dein Selbstbild anheben.',
                text: '— WSU (Washington State University)'
            }, {
                image: '/images/static/fact_03-' + $rootScope.resolution + '.jpg',
                title: 'Tanzen hilft gegen Depressionen.',
                text: '— NCBI (National Center for Biotechnology Information)'
            }, {
                image: '/images/static/fact_04-' + $rootScope.resolution + '.jpg',
                title: 'Menschen, die meditieren, lösen Herausforderungen des Alltags kreativer.',
                text: '— NCBI (National Center for Biotechnology Information)'
            }, {
                image: '/images/static/fact_05-' + $rootScope.resolution + '.jpg',
                title: 'Yoga kann Angst dauerhaft reduzieren.',
                text: '— NCBI (National Center for Biotechnology Information)'
            }
        ];

    }]);
