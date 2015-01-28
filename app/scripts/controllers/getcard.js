'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:GetcardCtrl
 * @description
 * # GetcardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Getcard', ['uiGmapgoogle-maps'])
    .controller('GetcardCtrl', ['$scope', '$rootScope', '$location', '$http', '$cookieStore', 'parallaxHelper', 'getLocations', 'getStudios', 'getCards', '$sce', '$window', '$document', '$modal', 'uiGmapGoogleMapApi', function ($scope, $rootScope, $location, $http, $cookieStore, parallaxHelper, getLocations, getStudios, getCards, $sce, $window, $document, $modal, uiGmapGoogleMapApi) {
        $scope.background = parallaxHelper.createAnimator(0.3, 50, 0, -$rootScope.windowHeight/2);
        $scope.fadeIn = parallaxHelper.createAnimator(-0.005, 1, 0, -$rootScope.windowHeight/1.2);

        $scope.video = {
            sources: [
                {src: $sce.trustAsResourceUrl('//assets.so-much-more.de/video/mainvideo.mp4'), type: 'video/mp4'},
                {src: $sce.trustAsResourceUrl('//assets.so-much-more.de/video/mainvideo.webm'), type: 'video/webm'}
            ],
            autoPlay: true,
            preload: true,
            loop: true,
            stretch: 'fill',
            responsive: true,
            poster: {
                url: '/images/mainvideo.jpg'
            },
            onPlayerReady: function(videoAPI) {
                $scope.videoAPI = videoAPI;
            }
        };

        var scrollPos = $('#subscribeMain').offset().top + 130;

        angular.element($window).bind('resize', function() {
            scrollPos = $('#subscribeMain').offset().top + 130;
        });

        $document.on('scroll', function() {
            $scope.showTopHeader = $document.scrollTop() > scrollPos;
            if ($rootScope.desktop) {
                if ($document.scrollTop() > $window.innerHeight) {
                    $scope.videoAPI.pause();
                } else {
                    $scope.videoAPI.play();
                }
            }
        });

        uiGmapGoogleMapApi.then(function() {

            $scope.map = {
                center: {
                    latitude: 52.520007,
                    longitude: 	13.404954
                },
                zoom: 12,
                options: {
                    mapTypeControl: false,
                    overviewMapControl: false,
                    panControl: false,
                    zoomControl : true,
                    streetViewControl : true,
                    scrollwheel: $rootScope.desktop
                }
            };

            var markerIcon = new Image().src = '/images/marker.svg';
            var markerIconHover = new Image().src = '/images/marker-hover.svg';

            $scope.markerEvents = {
                mouseover : function(marker, eventName, model) {
                    marker.setIcon(markerIconHover);
                    model.show = true;
                },
                mouseout : function(marker, eventName, model) {
                    marker.setIcon(markerIcon);
                    model.show = false;
                }
            };

        });

        getLocations.$promise.then(function (res) {
            $scope.locations = _.reject(res, function (obj) {
                return obj.latitude === null || obj.longitude === null;
            });
            _.map($scope.locations, function (obj) {
                obj.icon = '/images/marker.svg';
            });
        });

        $scope.invitation = $location.search().invitation;
        if ($scope.invitation) {
            $cookieStore.put('invitation', true);
        }
        $scope.invite = {};
        $scope.form = {};

        $scope.Math = $window.Math;
        $scope.cards = getCards.data;
        $scope.showDiscount = moment().isBefore('2015-02-01');

        $scope.tab = 'map';

        getStudios.$promise.then(function (res) {
            $scope.studios = res;
        });

        var setVoucher = function (code) {
            if ($scope.showDiscount) {
                $http.get($window.smmConfig.restUrlBase + '/api/rest/vouchers/' + code).success(function (res) {
                    if(res.valid && (res.subscriptionType === null || res.subscriptionType === $scope.order.type)) {
                        $scope.voucher = res;
                    }
                }).error(function (res) {
                    console.log(res);
                    $scope.voucher = null;
                });
            }
        };

        setVoucher('EARLY_BIRD_2014');


        $scope.subscribeCard = function (locate) {
            $scope.loadingSubscribe = true;
            $scope.successSubscribe = false;
            $scope.errorSubscribe = false;
            $http.post($window.smmConfig.restUrlBase + '/api/rest/invitations', { email: $scope.invite.email, postalCode: $scope.invite.postalCode, interestedInProduct: true }).success(function () {
                $scope.loadingSubscribe = false;
                $scope.successSubscribe = true;
                $scope.invite = {};
                $scope.form.subscribeForm.$setPristine();
                $window.ga('send', 'event', 'Invitations', 'onSubscribe', locate);
                $window.optimizely.push(['trackEvent', 'engagement_invitation_requested']);
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
        
        $scope.pushOptimizelyEvent = function (n) {
            $window.optimizely.push(['trackEvent', 'engagement_cta_click_' + n]);
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
                            $http.post($window.smmConfig.restUrlBase + '/api/message', suggestedStudio).success(function () {
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
