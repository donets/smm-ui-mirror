'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Signup', [])
    .controller('SignupCtrl', function ($scope, $rootScope, $q, $http, $cookieStore, $window, $document, $location, $modal, $interval, getCities, getCityId, RestApi, gettextCatalog, $analytics) {
        $scope.Math = $window.Math;
        $scope.month = _.range(1, 13);
        $scope.year = _.range(2014, 2033);

        $scope.init = function () {
            $analytics.eventTrack({
                'event': 'checkout',
                'checkoutStep': '1 – Checkout Started',
                'ecommerce': {
                    'checkout': {
                        'actionField': {'step': 1}
                    }
                }
            });
            $scope.cities = $rootScope.configCities;
            $scope.order = {
                deliveryAddress: {
                    city: $rootScope.currentCity.active ? $rootScope.currentCity.defaultName : $scope.cities[0].defaultName,
                    countryCode: $rootScope.countryCode
                },
                membershipActivatesOn: moment().format(),
                paymentProvider: 'STRIPE',
                newsletter: true,
                landingUrl: $cookieStore.get('landingUrl'),
                cityId: $rootScope.currentCity.active ? $rootScope.currentCity.id : $scope.cities[0].id,
                lang: $rootScope.lang,
                email: $window.sessionStorage.getItem('email')
            };
            $analytics.eventTrack({
                'event': 'changeCity',
                'selectedCity': $scope.currentCity.defaultName
            });
            RestApi.query({route: 'countries'}).$promise.then(function (res) {
                $scope.countries = res;
                $scope.cityChange();
            });
            setVoucher('EARLY_BIRD_2014');
        };

        $scope.$on('configLoaded', $scope.init);

        $scope.cityChange = function () {
            var selectedCity = _.findWhere($scope.cities, {id: $scope.order.cityId});
            $scope.order.deliveryAddress.city = selectedCity.defaultName;
            $scope.order.deliveryAddress.countryCode = selectedCity.countryCode;
            RestApi.query({route: 'plans', cityId: $scope.order.cityId}).$promise.then(function (res) {
                $scope.cards = res;
                if ($scope.signupSubmitted) {
                    if ($scope.cards.length === 1) {
                        $scope.changeType($scope.cards[0].code);
                        $scope.showCards = false;
                    } else {
                        $scope.showCards = true;
                        $interval(function () {
                            $document.scrollToElementAnimated($('#step2'), 260, 800);
                        }, 0, 1, {invokeApply: false});
                    }
                }
            });
            $scope.currentCountry = _.findWhere($scope.countries, {code: selectedCity.countryCode});
            $rootScope.supportPhone = selectedCity.supportPhone;
            $rootScope.supportEmail = selectedCity.supportEmail;
        };

        /*$scope.order = {
            "firstName": "Vlad",
            "lastName": "Donets",
            "email": "test3@somuchmore.org",
            "password": "TestTEST1234",
            "paymentProvider": "STRIPE",
            "newsletter": true,
            "type": "BLACK",
            "voucher": null,
            "deliveryAddress": {
                "prefix": "c/o Somuchmore",
                "streetAndHouse": "Axel-Springer-Str. 21",
                "zip": "10117",
                "city": "Berlin",
                "countryCode":"DE"
            },
            "card": {
                "number": "5555555555554444",
                "cvc": "123",
                "exp_month": 8,
                "exp_year": 2015,
                "name": "Max Musterman"
            }
        };*/

        $rootScope.showDatepicker = {};
        $rootScope.openDatepicker = function($event, type) {
            $event.preventDefault();
            $event.stopPropagation();
            $rootScope.showDatepicker[type] = true;
        };
        $rootScope.minStartDate = moment();
        $rootScope.dateOptions = {
            startingDay: 1,
            showWeekNumbers: false,
            showWeeks: false
        };

        $scope.invitation = $location.search().invitation;

        var setVoucher = function (code) {
            if (!$scope.order.voucher) {
                $http.get($window.smmConfig.restUrlBase + '/api/rest/vouchers/' + code).success(function (res) {
                    if(res.valid && res.subscriptionType === null) {
                        $scope.order.voucher = code;
                        $scope.voucher = res;
                    }
                }).error(function (res) {
                    console.log(res);
                    $scope.voucher = null;
                });
            }
        };

        $scope.checkVoucher = function (code) {
            $scope.successVoucher = false;
            $scope.errorVoucher = false;
            $scope.voucher = null;
            $scope.order.voucher = null;
            if (code) {
                $scope.order.voucher = code;
                $scope.loadingVoucher = true;
                $rootScope.handledError = true;
                $http.get($window.smmConfig.restUrlBase + '/api/rest/vouchers/' + code).success(function (res) {
                    $scope.loadingVoucher = false;
                    $rootScope.handledError = false;
                    if(res.valid && res.freeSubscriptionGranted && moment().isBefore('2015-01-01')) {
                        $scope.errorVoucher = 'notStarted';
                    } else if(res.valid && (res.subscriptionType === null || res.subscriptionType === $scope.order.type)) {
                        $scope.successVoucher = true;
                        $scope.voucher = res;
                    } else if(res.valid && res.subscriptionType !== $scope.order.type) {
                        $scope.errorVoucher = 'type';
                        $scope.typeVoucher = res.subscriptionType;
                    } else {
                        $scope.errorVoucher = 'valid';
                    }
                }).error(function (res) {
                    console.log(res);
                    $scope.loadingVoucher = false;
                    $rootScope.handledError = false;
                    $scope.errorVoucher = res.type === 'NotFoundException' ? 'valid' : true;
                });
            } else {
                $scope.formCheckout.voucher.$setPristine();
                setVoucher('EARLY_BIRD_2014');
            }
        };

        $scope.signupSubmit = function () {
            $scope.signupSubmitted = true;
            $scope.formSignup.$setPristine();
            if ($scope.cards.length === 1) {
                $scope.changeType($scope.cards[0].code);
                $scope.showCards = false;
            } else {
                $scope.showCards = true;
                $interval(function () {
                    $document.scrollToElementAnimated($('#step2'), 260, 800);
                }, 0, 1, {invokeApply: false});
            }

            $analytics.eventTrack({
                'event': 'checkout',
                'subscriptionCity': _.findWhere($scope.cities, {id: $scope.order.cityId}).defaultName,
                'daysToStart': '0',                 // Set to nr of days left to the start of subscription (default is 0).
                'checkoutStep': '2 – Personal Info Set',
                'ecommerce': {
                    'checkout': {
                        'actionField': {'step': 2}
                    }
                }
            });
        };

        $scope.changeType = function (type) {
            $scope.checkVoucher($scope.code);
            if (type) {
                $scope.order.type = type;
            }
            $scope.overview = {
                card: _.findWhere($scope.cards, {code: $scope.order.type}).displayName,
                price: _.findWhere($scope.cards, {code: $scope.order.type}).monthlyPrice,
                preOfferPrice: _.findWhere($scope.cards, {code: $scope.order.type}).preOfferPrice,
                currency: _.findWhere($scope.cards, {code: $scope.order.type}).currency
            };
            $scope.showCheckout = true;
            $analytics.eventTrack({
                'event': 'checkout',
                'subscriptionCity': _.findWhere($scope.cities, {id: $scope.order.cityId}).defaultName,
                'checkoutStep': '3 – Card Selected',
                'ecommerce': {
                    'checkout': {
                        'actionField': {
                            'step': 3,
                            'option': _.findWhere($scope.cards, {code: $scope.order.type}).displayName
                        }     // set to a chosen card type: 'White Card Lite'|'White Card'|'Black Card'
                    }
                }
            });
            $interval(function () {
                $document.scrollToElementAnimated($('#step3'), 60, 800);
            }, 0, 1, {invokeApply: false});
        };

        $scope.checkoutSubmit = function () {
            $scope.formCheckout.$setPristine();
            $scope.error = null;
            $scope.errorMsg = '';
            $scope.showSpinner = true;
            $rootScope.handledError = true;
            $http.post($window.smmConfig.restUrlBase + '/api/membership/order', $scope.order).success(function (response) {

                $rootScope.handledError = false;
                console.log(response);
                $window.ga('send', 'event', 'Signup', 'onOrder');
                $rootScope.userName = response.user.name;
                $rootScope.roleMember = _.include(response.user.roles, 'member') ? true : false;
                $rootScope.roleAdmin = _.include(response.user.roles, 'admin') ? true : false;
                $cookieStore.put('session', response.user);
                $cookieStore.put('signupPopap', true);
                $analytics.eventTrack({
                    'event': 'registerSuccess',
                    'registerMethod': 'Website',
                    'customerId': response.user.id,
                    'subscriptionCity': _.findWhere($scope.cities, {id: $scope.order.cityId}).defaultName
                });
                $analytics.eventTrack({
                    'event': 'transaction',
                    'promoCodeUsed': $scope.order.voucher,
                    'paymentMethod': response.membership.paymentProvider,
                    'ecommerce': {
                        'currencyCode': _.findWhere($scope.cards, {code: $scope.order.type}).currency,
                        'purchase': {
                            'actionField': {
                                'id': response.membership.id,
                                'revenue': response.membership.current.monthlyPrice,
                                'coupon': $scope.order.voucher
                            },
                            'products': [
                                {
                                    'name': response.membership.current.type,
                                    'id': response.membership.cardNumber,
                                    'price': response.membership.current.monthlyPrice,
                                    'quantity': '1'
                                }
                            ]}
                    }
                });
                $analytics.eventTrack({
                    'event': 'loginSuccess',
                    'loginMethod': 'Website',
                    'customerId': response.user.id
                });
                $window.rockVarSet.push({
                    'customerId': response.user.id,
                    'customerStatus': 'new'
                });
                $rootScope.$state.go('dashboard', {city: response.membership.cityId});

            }).error(function (response) {
                $analytics.eventTrack({
                    'event': 'paymentFailed',
                    'paymentMethod': $scope.order.paymentProvider,
                    'errorMessage': 'Entered card number is invalid'
                });
                $analytics.eventTrack({
                    'event': 'loginFailed',
                    'loginMethod': 'Website',
                    'errorMessage': response.type
                });
                $scope.showSpinner = false;
                $rootScope.handledError = false;
                $scope.error = response.type;
                $scope.errorMsg = response.message;
                $analytics.eventTrack({
                    'event': 'registerFailed',
                    'registerMethod': 'Website',
                    'subscriptionCity': _.findWhere($scope.cities, {id: $scope.order.cityId}).defaultName,
                    'errorMessage': $scope.error
                });
            });
        };

        $scope.missingCard = function () {
            $modal.open({
                templateUrl: 'app/views/modalMessage.html',
                controller: ['$scope', '$modalInstance', '$http', '$window', 'name', 'email',

                    function ($scope, $modalInstance, $http, $window, name, email) {

                        $scope.message = {
                            name: name,
                            email: email,
                            message: gettextCatalog.getString('I don’t have a credit card, but still wish to order the Somuchmore card. Please contact me!')
                        };

                        $scope.sendMessage = function() {
                            $scope.loading = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/message', $scope.message).success(function () {
                                $scope.loading = false;
                                $scope.success = true;
                            }).error(function (response, status) {
                                $scope.loading = false;
                                $scope.error = true;
                                console.error(status);
                            });
                        };

                        $scope.close = function () {
                            $modalInstance.close(false);
                        };

                    }],
                backdrop: 'static',
                windowClass: 'modal-suggest',
                resolve: {
                    name: function () {
                        return $scope.order.firstName && $scope.order.lastName && $scope.order.firstName + ' ' + $scope.order.lastName;
                    },
                    email: function () {
                        return $scope.order.email;
                    }
                }
            });
        };

        $scope.orderChange = function (type) {
            if (type === 'card' && $scope.error === 'CardException') {
                $scope.error = null;
            }
        };

        $scope.checkCard = function (card) {
            var patts = [
                {regex: /^4[0-9]{12}(?:[0-9]{3})?$/g, type: 'visa'},
                {regex: /^5[1-5]\d{14}$/g, type: 'masterCard'},
                {regex: /^(?:5[0678]\d\d|6304|6390|67\d\d)\d{8,15}$/g, type: 'maestroCard'}
            ];
            if (card) {
                _.each(patts, function (patt) {
                    var valid = patt.regex.test(card);
                    if (valid) {
                        $scope.creditCard = patt.type;
                    }
                });
            } else {
                $scope.creditCard = null;
            }
        };

      $scope.localizedSelect = gettextCatalog.getString('Select');
      $scope.localizedSelected = gettextCatalog.getString('Selected');
      $scope.localizedUnlimited = gettextCatalog.getString('Unlimited');

    });
