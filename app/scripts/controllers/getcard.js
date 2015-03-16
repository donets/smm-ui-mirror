'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:GetcardCtrl
 * @description
 * # GetcardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Getcard', ['uiGmapgoogle-maps'])
    .controller('GetcardCtrl', ['$scope', '$rootScope', '$location', '$http', '$cookieStore', 'parallaxHelper', 'getCities', 'getDisciplines', '$sce', '$window', '$document', '$modal', 'uiGmapGoogleMapApi', 'RestApi', '$timeout', 'gettextCatalog', 'CityFactory', 'UserMap', function ($scope, $rootScope, $location, $http, $cookieStore, parallaxHelper, getCities, getDisciplines, $sce, $window, $document, $modal, uiGmapGoogleMapApi, RestApi, $timeout, gettextCatalog, CityFactory, UserMap) {
        $scope.background = parallaxHelper.createAnimator(0.3, 50, 0, -$rootScope.windowHeight/2);
        $scope.fadeIn = parallaxHelper.createAnimator(-0.005, 1, 0, -$rootScope.windowHeight/1.2);

        $scope.video = {
            sources: [
                {src: $sce.trustAsResourceUrl('//assets.so-much-more.de/video/20150130_smm_header.mp4'), type: 'video/mp4'},
                {src: $sce.trustAsResourceUrl('//assets.so-much-more.de/video/20150130_smm_header.mov.webm'), type: 'video/webm'}
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
                if ($rootScope.desktop) {
                    $scope.videoAPI = videoAPI;
                }
            }
        };

        var el = $('#subscribeMain');

        $timeout(function () {
            $scope.scrollPos = Math.round(el.offset().top + 130);
        }, 0);

        angular.element($window).bind('resize', function() {
            $scope.scrollPos = Math.round(el.offset().top + 130);
        });

        $document.on('scroll', function() {
            if ($rootScope.desktop) {
                $scope.showTopHeader = $document.scrollTop() > $scope.scrollPos;
                if ($scope.videoAPI) {
                    if ($document.scrollTop() > $window.innerHeight) {
                        $scope.videoAPI.pause();
                    } else {
                        $scope.videoAPI.play();
                    }
                }
            } else {
                $scope.showBottomMobile = $document.scrollTop() > $('.b-main-cover').outerHeight();
            }
        });

        $scope.invite = {};
        $scope.form = {};

        $scope.Math = $window.Math;
        $scope._ = $window._;
        $scope.disciplinesList = getDisciplines.data;

        $scope.tab = 'map';

        $scope.invitation = $location.search().invitation;
        $scope.discipline = $location.search().discipline;

        $cookieStore.put('landingUrl', $location.url());

        $scope.init = function() {
            CityFactory.getCities().then(function (res) {
                $scope.citiesList = _.sortBy(res, 'id').filter(function (c) {
                    return c.countryCode === $rootScope.countryCode;
                });

                CityFactory.guessCity($scope.citiesList).then(function(res) {
                    $scope.city = res.city;
                    $scope.cityId = res.cityId;
                    $scope.changeCity(res.campaign);
                });
            });
        }


        $scope.init();

        $scope.changeCity = function(campaign) {
            CityFactory.changeCity(campaign, $scope.citiesList).then(function(res) {
                $scope.studios = res.studios;
                $scope.cards = res.cards;
                if(typeof($scope.campaign) !== "undefined") {
                    $scope.campaign = campaign;
                    $rootScope.rootCampaign = campaign;
                }
            }).then(function() {
                $rootScope.$watch('rootCampaign', function(newVal, oldVal) {
                    $scope.campaign = newVal;
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }

                });
            });
        }




        var setVoucher = function (code) {
            $http.get($window.smmConfig.restUrlBase + '/api/rest/vouchers/' + code).success(function (res) {
                if(res.valid && res.subscriptionType === null) {
                    $scope.showDiscount = moment().isBefore(moment(res.validUntil));
                    $scope.voucher = res;
                    $scope.validUntilIn = moment(res.validUntil).subtract(1, 'd');
                }
            }).error(function (res) {
                console.log(res);
                $scope.voucher = null;
            });
        };

        setVoucher('EARLY_BIRD_2014');


        $scope.subscribeCard = function (locate) {
            $scope.form.loadingSubscribe = true;
            $scope.form.successSubscribe = false;
            $scope.form.errorSubscribe = false;
            $http.post($window.smmConfig.restUrlBase + '/api/rest/invitations', { email: $scope.invite.email, postalCode: $scope.invite.postalCode, landingUrl: $cookieStore.get('landingUrl'), cityId: $scope.cityId, interestedInProduct: true, lang: $rootScope.lang }).success(function () {
                $scope.form.loadingSubscribe = false;
                $scope.form.successSubscribe = true;
                $scope.invite = {};
                $scope.subscribeForm[locate].$setPristine();
                $window.ga('send', 'event', 'Invitations', 'onSubscribe', locate);
                //$window.optimizely.push(['trackEvent', 'engagement_invitation_requested']);
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
                $scope.form.loadingSubscribe = false;
                $scope.form.errorSubscribe = true;
                console.error(status);
            });
        };

        $scope.pushOptimizelyEvent = function (type) {
			if (type === 'invitation' || $scope.invitation) {
				//$window.optimizely.push(['trackEvent', 'engagement_cta_invited']);
			} else {
				//$window.optimizely.push(['trackEvent', 'engagement_cta_direct']);
			}
        };

        $scope.contact = {};

        $scope.contactSubmit = function() {
            $scope.loadingContact = true;
            $scope.contact.message = 'contact teacher partnership';
            $scope.contact.city = $scope.campaign.defaultName;
            $http.post($window.smmConfig.restUrlBase + '/api/message', $scope.contact).success(function () {
                $scope.loadingContact = false;
                $scope.successContact = true;
                $scope.contact = {};
                $scope.contactForm.$setPristine();
            }).error(function (response, status) {
                $scope.loadingContact = false;
                $scope.errorContact = true;
                console.error(status);
            });
        };

        $scope.suggestStudio = function () {
            $modal.open({
                templateUrl: 'views/modalSuggest.html',
                controller: ['$scope', '$modalInstance', '$http', 'parentScope',

                    function ($scope, $modalInstance, $http, parentScope) {

                        $scope.suggest = {};

                        $scope.addStudio = function () {
                            console.log($scope.suggest);
                            var suggestedStudio = {
                                email: $scope.suggest.userEmail || 'noreply@somuchmore.org',
                                message: 'A user ' + ($scope.suggest.userName + ' ' || '') + 'suggest we should add studio: ' + $scope.suggest.studioName,
                                city: parentScope.campaign.defaultName
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
                resolve: {
                    parentScope : function () {
                        return $scope;
                    }
                },
                windowClass: 'modal-suggest'
            });
        };

        $scope.openSubscribe = function () {
            $modal.open({
                templateUrl: 'views/modalSubscribe.html',
                controller: ['$scope', '$modalInstance', '$http', 'scope',

                    function ($scope, $modalInstance, $http, scope) {

                        $scope.subscribeCard = scope.subscribeCard;
                        $scope.invite = scope.invite;
                        $scope.form = scope.form;

                        $scope.close = function () {
                            $modalInstance.close(true);
                        };

                    }],
                backdrop: 'static',
                resolve: {
                    scope : function () {
                        return $scope;
                    }
                },
                windowClass: 'modal-suggest'
            });
        };

        $scope.slides = [
            {
                image: '/images/static/fact_01-' + $rootScope.resolution + '.jpg',
                title: gettextCatalog.getString('Meditation kann Dir die Gehirnkapazität eines 25-jährigen erhalten.'),
                text: gettextCatalog.getString('— NCBI (National Center for Biotechnology Information)')
            }, {
                image: '/images/static/fact_02-' + $rootScope.resolution + '.jpg',
                title: gettextCatalog.getString('Yoga kann schon nach 3 Monaten Dein Selbstbild anheben.'),
                text: gettextCatalog.getString('— WSU (Washington State University)')
            }, {
                image: '/images/static/fact_03-' + $rootScope.resolution + '.jpg',
                title: gettextCatalog.getString('Tanzen hilft gegen Depressionen.'),
                text: gettextCatalog.getString('— NCBI (National Center for Biotechnology Information)')
            }, {
                image: '/images/static/fact_04-' + $rootScope.resolution + '.jpg',
                title: gettextCatalog.getString('Menschen, die meditieren, lösen Herausforderungen des Alltags kreativer.'),
                text: gettextCatalog.getString('— NCBI (National Center for Biotechnology Information)')
            }, {
                image: '/images/static/fact_05-' + $rootScope.resolution + '.jpg',
                title: gettextCatalog.getString('Yoga kann Angst dauerhaft reduzieren.'),
                text: gettextCatalog.getString('— NCBI (National Center for Biotechnology Information)')
            }
        ];

        $scope.localizedUnlimited = gettextCatalog.getString('Unbegrenzt');
    }]);
