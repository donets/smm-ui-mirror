'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:HomepageCtrl
 * @description
 * # HomepageCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Homepage', ['uiGmapgoogle-maps'])
    .controller('HomepageCtrl', function ($scope, $rootScope, $location, $http, $cookieStore, getDisciplines, $sce, $window, $document, $modal, uiGmapGoogleMapApi, RestApi, $interval, gettextCatalog, CityFactory, $analytics) {

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

        $interval(function () {
            $scope.scrollPos = Math.round(el.offset().top + 130);
        }, 1000, 1, {invokeApply: false});

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

        var selectDiscipline = function() {
            var locationDiscipline = $location.search().discipline;
            var discipline = _.findWhere($scope.disciplinesList.disciplines, {name: locationDiscipline});
            if(discipline) {
                $scope.discipline = discipline;
            }
        };

        selectDiscipline();

        if (!$cookieStore.get('landingUrl')) {
            $cookieStore.put('landingUrl', $location.absUrl());
        }

        $scope.init = function () {
            $scope.CityFactory = CityFactory.CityFactory;

            $scope.$on('CityFactory.update', function () {
                var currentCityVar = CityFactory.getVariable();
                $scope.currentCity = _.findWhere($scope.citiesList, {id: currentCityVar.id});
                $scope.currentCityId = $scope.currentCity.id;
                $rootScope.supportPhone = $scope.currentCity.supportPhone;
                $rootScope.supportEmail = $scope.currentCity.supportEmail;
                if ($scope.currentCity.countryCode !== $rootScope.countryCode) {
                    var newCountry = _.findWhere($scope.countries, {code: $scope.currentCity.countryCode});
                    $window.location.href = newCountry.defaultDomain.absUrlBase + '?city=' + $scope.currentCity.shortCode;
                }
            });

            $scope.update = CityFactory.update;

            $scope.citiesList = $rootScope.configCities;
            RestApi.query({route: 'countries'}).$promise.then(function (res) {
                $scope.countries = res;
                $scope.city = $rootScope.currentCity;
                $scope.cityId = $rootScope.currentCity.id;
                $scope.changeCity($rootScope.currentCity.id);
            });
        };

        $scope.$on('configLoaded', $scope.init);


        $scope.changeCity = function (currentCityId) {
            $rootScope.currentCity = _.findWhere($scope.citiesList, {id: currentCityId});
            CityFactory.update($rootScope.currentCity, $scope.citiesList);
            CityFactory.changeCity($rootScope.currentCity, $scope.citiesList).then(function (res) {
                $scope.studios = res.studios;
                $scope.cards = res.cards;
                $scope.combinedLocations = [];
                RestApi.query({route: 'locations'}).$promise.then(function (res) {
                    _.each($scope.studios, function (studio) {
                        _.each(studio.locations, function (locationId) {
                            var location = {};
                            _.extend(location,_.findWhere(res, {id: locationId}));
                            location.studioProfileComplete = studio.profileComplete;
                            location.studioId = studio.id;
                            $scope.combinedLocations.push(location);
                        });
                    });
                });
            });
            $rootScope.countryCode = $rootScope.currentCity.countryCode;
        };


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
            var invitation = {
                email: $scope.invite.email,
                postalCode: $scope.invite.postalCode,
                landingUrl: $cookieStore.get('landingUrl'),
                cityId: $scope.currentCity.id,
                interestedInProduct: true,
                lang: $rootScope.lang
            };
            $http.post($window.smmConfig.restUrlBase + '/api/rest/invitations', invitation).success(function (response) {
                $scope.form.loadingSubscribe = false;
                $scope.form.successSubscribe = true;
                $http.post($window.smmConfig.restUrlBase + '/api/message', {email: $scope.invite.email, message: JSON.stringify($window.smmConfig)});
                $scope.invite = {};
                $scope.subscribeForm[locate].$setPristine();
                $window.ga('send', 'event', 'Invitations', 'onSubscribe', locate);
                //$window.optimizely.push(['trackEvent', 'engagement_invitation_requested']);
                $analytics.eventTrack({
                    'event': 'requestInvitation',
                    'selectedCity': response.city,
                    'zipCode': response.postalCode,
                    'inviteIEmail': response.email
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
            $scope.contact.city = $scope.currentCity.defaultName;
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
                controller: ['$scope', '$modalInstance', '$http', 'parentScope', '$interval',

                    function ($scope, $modalInstance, $http, parentScope, $interval) {

                        $scope.suggest = {};

                        $scope.addStudio = function () {
                            console.log($scope.suggest);
                            var suggestedStudio = {
                                email: $scope.suggest.userEmail || 'noreply@somuchmore.org',
                                message: 'A user ' + ($scope.suggest.userName + ' ' || '') + 'suggest we should add studio: ' + $scope.suggest.studioName,
                                city: parentScope.currentCity.defaultName
                            };
                            $scope.loadingStudio = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/message', suggestedStudio).success(function () {
                                $scope.loadingStudio = false;
                                $scope.successStudio = true;
                                $window.ga('send', 'event', 'card_page', 'studio_suggestion');
                                $interval(function () {
                                    $modalInstance.dismiss();
                                }, 0, 1, {invokeApply: false});
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
                title: gettextCatalog.getString('Meditation can increase your brain capacity to that of a 25-year-old.'),
                text: gettextCatalog.getString('— NCBI (National Center for Biotechnology Information)')
            }, {
                image: '/images/static/fact_02-' + $rootScope.resolution + '.jpg',
                title: gettextCatalog.getString('Yoga has been proven to help self-image and self-love after just 3 months.'),
                text: gettextCatalog.getString('— WSU (Washington State University)')
            }, {
                image: '/images/static/fact_03-' + $rootScope.resolution + '.jpg',
                title: gettextCatalog.getString('Dancing helps to alleviate depression.'),
                text: gettextCatalog.getString('— NCBI (National Center for Biotechnology Information)')
            }, {
                image: '/images/static/fact_04-' + $rootScope.resolution + '.jpg',
                title: gettextCatalog.getString('People who meditate are able to deal with everyday challenges more creatively.'),
                text: gettextCatalog.getString('— NCBI (National Center for Biotechnology Information)')
            }, {
                image: '/images/static/fact_05-' + $rootScope.resolution + '.jpg',
                title: gettextCatalog.getString('Yoga helps to reduce anxiety and manage stress.'),
                text: gettextCatalog.getString('— NCBI (National Center for Biotechnology Information)')
            }
        ];

        $scope.localizedUnlimited = gettextCatalog.getString('Unlimited');
    });
