'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:GetcardCtrl
 * @description
 * # GetcardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Getcard', [])
    .controller('GetcardCtrl', ['$scope', '$rootScope', '$http', 'parallaxHelper', 'navigator', '$window', '$modal', function ($scope, $rootScope, $http, parallaxHelper, navigator, $window, $modal) {
        $scope.background = parallaxHelper.createAnimator(0.3, 50, 0, -$rootScope.windowHeight/2);
        $scope.fadeIn = parallaxHelper.createAnimator(-0.005, 1, 0, -$rootScope.windowHeight/1.2);
        if (navigator.platform() === 'Mac' && navigator.browser() === 'firefox') {
            $scope.hiddenFF = true;
        }
        $scope.subscribeCard = function (locate) {
            $scope.loadingSubscribe = true;
            $scope.successSubscribe = false;
            $scope.errorSubscribe = false;
            $http.post($window.smmConfig.restUrlBaseOld + '/api/subscribtion/subscribe', { email: $scope.email, interestedInProduct: true }).success(function () {
                $scope.loadingSubscribe = false;
                $scope.successSubscribe = true;
                $scope.email = '';
                $scope.subscribeForm.$setPristine();
                $window.ga('send', 'event', 'card_page', 'submitemail_' + locate);
            }).error(function (response, status) {
                $scope.loadingSubscribe = false;
                $scope.errorSubscribe = true;
                console.error(status);
            });
        };
        $scope.studios = [
            'Ashtanga Yoga','Aum Yoga','Axt','Bikram Mitte','Chimosa','Die Yogapraxis','FlyingYoga','Ginger Bar','Iyengar','Jivamukti','Kalaa Yoga berlin','Lagao Yoga','LOVT','Middendorf','Open Arms Yoga','Padma Yoga','Peace Yoga','Rafaela Rarisch Concept Store','Randori Pro','Raum für Yoga','Remedy','Spirit Yoga','SunYoga','Tayome','Tri Yoga Akademie Berlin','Yellow','Yoga & More','Yoga 4 all','Yoga für Dich','Yoga im Graefekiez','Yoga School Berlin','YOGA SKY','Yoga Team Berlin','Yogacircle','YogaDelta','Yogaraum Berlin','Yogaschule Kreuzberg','Yogastudio Körperklang','Yogatribe','YogaZentrum Akazienhof','Yogibar'
        ];
        $scope.bookCard = function (type) {
            $modal.open({
                templateUrl: 'views/modalSubscribe.html',
                controller: ['$scope', '$modalInstance', '$http', 'cardType',

                    function ($scope, $modalInstance, $http, cardType) {

                        $scope.subscribeCard = function () {
                            $scope.loadingSubscribe = true;
                            $scope.successSubscribe = false;
                            $scope.errorSubscribe = false;
                            $http.post($window.smmConfig.restUrlBaseOld + '/api/subscribtion/subscribe', { email: this.email, interestedInProduct: true }).success(function () {
                                $scope.loadingSubscribe = false;
                                $scope.successSubscribe = true;
                                $window.ga('send', 'event', 'card_page', 'submitemail_' + cardType);
                                setTimeout(function () {
                                    $modalInstance.dismiss();
                                }, 200);
                            }).error(function (response, status) {
                                $scope.loadingSubscribe = false;
                                $scope.errorSubscribe = true;
                                console.error(status);
                            });
                        };

                        $scope.close = function () {
                            $modalInstance.close(true);
                        };

                    }],
                backdrop: 'static',
                windowClass: 'modal-subscribe',
                resolve: {
                    cardType: function () {
                        return type;
                    }
                }
            });
        };

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
                            $http.post($window.smmConfig.restUrlBaseOld + '/api/message/', suggestedStudio).success(function () {
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
                image: '/images/fact_01.jpg',
                title: 'Meditation kann Dir die Gehirnkapazität eines 25-jährigen erhalten.',
                text: '— NCBI (National Center for Biotechnology Information)'
            }, {
                image: '/images/fact_02.jpg',
                title: 'Yoga kann schon nach 3 Monaten Dein Selbstbild anheben.',
                text: '— WSU (Washington State University)'
            }, {
                image: '/images/fact_03.jpg',
                title: 'Tanzen hilft gegen Depressionen.',
                text: '— NCBI (National Center for Biotechnology Information)'
            }, {
                image: '/images/fact_04.jpg',
                title: 'Menschen, die meditieren, lösen Herausforderungen des Alltags kreativer.',
                text: '— NCBI (National Center for Biotechnology Information)'
            }, {
                image: '/images/fact_05.jpg',
                title: 'Yoga kann Angst dauerhaft reduzieren.',
                text: '— NCBI (National Center for Biotechnology Information)'
            }
        ]

    }]);
