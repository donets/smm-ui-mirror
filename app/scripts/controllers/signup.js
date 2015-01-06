'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Signup', [])
    .controller('SignupCtrl', function ($scope, $rootScope, $q, $http, $cookieStore, $window, $document, getCards, getStudios) {
        $scope.Math = $window.Math;
        $scope.startDate = moment.max(moment('2015-01-01'), moment()).format('DD.MM.YYYY');
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
            newsletter: true
        };

        /*$scope.order = {
            "firstName": "Vlad",
            "lastName": "Donets",
            "email": "test3@somuchmore.org",
            "password": "TestTEST1234",
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
                $scope.formSignup.voucher.$setPristine();
                setVoucher('EARLY_BIRD_2014');
            }
        };

        $scope.changeType = function () {
            $scope.typeMessage = false;
            $scope.checkVoucher($scope.code);
            $scope.overview = {
                card: _.findWhere($scope.cards, {type: $scope.order.type}).name,
                price: _.findWhere($scope.cards, {type: $scope.order.type}).price
            };
        };

        $scope.signupSubmit = function () {
            if ($scope.order.type) {
                $scope.formSignup.$setPristine();
                $scope.error = null;
                $scope.errorMsg = '';
                $scope.showSpinner = true;
                $rootScope.handledError = true;
                $http.post($window.smmConfig.restUrlBase + '/api/membership/order', $scope.order).success(function (response) {

                    $scope.showSpinner = false;
                    $rootScope.handledError = false;
                    console.log(response);
                    $window.ga('send', 'event', 'Signup', 'onOrder');
                    $rootScope.userName = response.user.name;
                    $rootScope.roleMember = _.include(response.user.roles, 'member') ? true : false;
                    $rootScope.roleAdmin = _.include(response.user.roles, 'admin') ? true : false;
                    $cookieStore.put('session', response.user);
                    $rootScope.$state.go('profile.dashboard');

                }).error(function (response) {

                    $scope.showSpinner = false;
                    $rootScope.handledError = false;
                    $scope.error = response.type;
                    $scope.errorMsg = response.message;
                });
            } else {
                $document.scrollToElementAnimated($('#cards'), 0, 800);
                $scope.typeMessage = true;
            }
        };

        $scope.orderChange = function (type) {
            if (type === 'card' && $scope.error === 'CardException') {
                $scope.error = null;
            }
        };
        
    });
