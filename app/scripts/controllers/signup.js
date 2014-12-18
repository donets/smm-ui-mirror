'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Signup', [])
    .controller('SignupCtrl', function ($scope, $rootScope, $q, $http, $window, $document, getCards, getStudios) {
        $scope.Math = $window.Math;
        $scope.startDate = moment.max(moment('2015-01-01'), moment()).format('DD.MM.YYYY');
        getStudios.$promise.then(function (res) {
            $scope.studios = res;
        });
        $scope.cards = getCards.data;
        $scope.order = {
            deliveryAddress: {
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
                "exp_month": "8",
                "exp_year": "2015",
                "name": "Max Musterman"
            }
        };*/

        var setVoucher = function (code) {
            if (moment().isBefore('2015-01-01', 'year') && !$scope.order.voucher) {
                $http.get($window.smmConfig.restUrlBase + '/api/rest/vouchers/' + code).success(function (res) {
                    if(res.valid && (res.subscriptionType === null || res.subscriptionType === $scope.order.type)) {
                        $scope.order.voucher = $scope.code;
                        $scope.voucher = res;
                    }
                }).error(function (res) {
                    console.log(res);
                    $scope.voucher = null;
                });
            }
        };

        setVoucher('EARLY_BIRD_2014');

        $scope.checkVoucher = function () {
            $scope.successVoucher = false;
            $scope.errorVoucher = false;
            $scope.voucher = null;
            $scope.order.voucher = null;
            setVoucher('EARLY_BIRD_2014');
            if ($scope.code) {
                $scope.loadingVoucher = true;
                $http.get($window.smmConfig.restUrlBase + '/api/rest/vouchers/' + $scope.code).success(function (res) {
                    $scope.loadingVoucher = false;
                    if(res.valid && res.freeSubscriptionGranted) {
                        $scope.errorVoucher = 'notStarted';
                    } else if(res.valid && (res.subscriptionType === null || res.subscriptionType === $scope.order.type)) {
                        $scope.successVoucher = true;
                        $scope.order.voucher = $scope.code;
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
                    $scope.errorVoucher = 'valid';
                });
            } else {
                $scope.formSignup.voucher.$setPristine();
            }
        };

        $scope.changeType = function () {
            $scope.typeMessage = false;
            setVoucher('EARLY_BIRD_2014');
            $scope.checkVoucher();
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
                $http.post($window.smmConfig.restUrlBase + '/api/membership/order', $scope.order).success(function (response) {

                    console.log(response);
                    $scope.showSpinner = false;
                    $window.ga('send', 'event', 'Signup', 'onOrder');
                    $rootScope.userName = response.user.name;
                    $rootScope.roleMember = _.include(response.user.roles, 'member') ? true : false;
                    $rootScope.roleAdmin = _.include(response.user.roles, 'admin') ? true : false;
                    $rootScope.$state.go('profile.dashboard');

                }).error(function (response) {

                    $scope.showSpinner = false;
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
