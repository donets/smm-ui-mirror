'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Signup', [])
    .controller('SignupCtrl', function ($scope, $rootScope, $q, $http, $cookieStore, $window, $document, $location, $modal, $timeout, getCards, getStudios) {
        $scope.Math = $window.Math;
        $scope.showDiscount = moment().isBefore('2015-02-01');
        getStudios.$promise.then(function (res) {
            $scope.studios = res;
        });
        $scope.cards = getCards.data;
        $scope.month = _.range(1, 13);
        $scope.year = _.range(2014, 2033);
        $scope.order = {
            deliveryAddress: {
                city: 'Berlin',
                countryCode: 'DE'
            },
            membershipActivatesOn: moment.tz('Europe/Berlin').format(),
            paymentProvider: 'STRIPE',
            newsletter: true
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
        $rootScope.minStartDate = new Date();
        $rootScope.dateOptions = {
            startingDay: 1,
            showWeekNumbers: false,
            showWeeks: false
        };

        $scope.invitation = $location.search().invitation;

        var setVoucher = function (code) {
            if ($scope.showDiscount && !$scope.order.voucher) {
                $http.get($window.smmConfig.restUrlBase + '/api/rest/vouchers/' + code).success(function (res) {
                    if(res.valid && (res.subscriptionType === null || res.subscriptionType === $scope.order.type)) {
                        $scope.order.voucher = code;
                        $scope.voucher = res;
                    }
                }).error(function (res) {
                    console.log(res);
                    $scope.voucher = null;
                });
            }
        };

        setVoucher('EARLY_BIRD_2014');

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
            $scope.formSignup.$setPristine();
            $scope.error = null;
            $scope.showSpinner = true;
            $scope.order.freeTrialGranted = $('#freeTrialGranted').val();
            $window.optimizely.push(['trackEvent', 'signup_step_click_1']);
            var tracking = $cookieStore.get('invitation') ? 'invitation' : 'direct';
            var platform = $rootScope.desktop ? 'web' : 'mobile';
            var invitation = {
                firstName: $scope.order.firstName,
                lastName: $scope.order.lastName,
                email: $scope.order.email,
                name: $scope.order.firstName + ' ' + $scope.order.lastName,
                checkoutStarted: true,
                tracking: tracking + ',' + platform
            };
            $http.post($window.smmConfig.restUrlBase + '/api/rest/invitations', invitation).success(function () {

                $scope.showSpinner = false;
                $scope.showCards = true;
                $timeout(function () {
                    $document.scrollToElementAnimated($('#step2'), 90, 800);
                }, 0);

            }).error(function (response) {

                $scope.showSpinner = false;
                $scope.error = response.type;
            });
        };

        $scope.changeType = function () {
            $scope.checkVoucher($scope.code);
            $scope.overview = {
                card: _.findWhere($scope.cards, {type: $scope.order.type}).name,
                price: _.findWhere($scope.cards, {type: $scope.order.type}).price
            };
            $scope.showCheckout = true;
            $window.optimizely.push(['trackEvent', 'signup_step_click_2']);
            $timeout(function () {
                $document.scrollToElementAnimated($('#step3'), 60, 800);
            }, 0);
        };

        $scope.checkoutSubmit = function () {
            $scope.formCheckout.$setPristine();
            $scope.error = null;
            $scope.errorMsg = '';
            $scope.showSpinner = true;
            $rootScope.handledError = true;
            $window.optimizely.push(['trackEvent', 'signup_step_click_3']);
            $http.post($window.smmConfig.restUrlBase + '/api/membership/order', $scope.order).success(function (response) {

                $rootScope.handledError = false;
                console.log(response);
                $window.ga('send', 'event', 'Signup', 'onOrder');
                if ($scope.invitation) {
                    $window.optimizely.push(['trackEvent', 'invited_signup_completed']);
                } else {
                    $window.optimizely.push(['trackEvent', 'direct_signup_completed']);
                }
                $rootScope.userName = response.user.name;
                $rootScope.roleMember = _.include(response.user.roles, 'member') ? true : false;
                $rootScope.roleAdmin = _.include(response.user.roles, 'admin') ? true : false;
                $cookieStore.put('session', response.user);
                $cookieStore.put('signupPopap', true);
                $rootScope.$state.go('dashboard');

            }).error(function (response) {

                $scope.showSpinner = false;
                $rootScope.handledError = false;
                $scope.error = response.type;
                $scope.errorMsg = response.message;
            });
        };

        $scope.missingCard = function () {
            $modal.open({
                templateUrl: 'views/modalMessage.html',
                controller: ['$scope', '$modalInstance', '$http', '$window', 'name', 'email',

                    function ($scope, $modalInstance, $http, $window, name, email) {

                        $scope.message = {
                            name: name,
                            email: email,
                            message: 'Ich habe keine Kreditkarte, möchte die Somuchmore Card aber trotzdem bestellen. Bitte kontaktiert mich dazu!'
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
        
    });
