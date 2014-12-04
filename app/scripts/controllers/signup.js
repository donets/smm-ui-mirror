'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Signup', [])
    .controller('SignupCtrl', function ($scope, $rootScope, $q, $http, $window, $document, getStudios) {
        $scope.studios = getStudios.data;
        $scope.order = {
            deliveryAddress: {
                countryCode: 'DE'
            },
            newsletter: true
        };

        /*$scope.order = {
            "firstName": "Vlad",
            "lastName": "Donets",
            "email": "test1@somuchmore.org",
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

        $scope.checkVoucher = function () {
            if ($scope.voucher) {
                $scope.loadingVoucher = true;
                $scope.successVoucher = false;
                $scope.errorVoucher = false;
                $http.get($window.smmConfig.restUrlBase + '/api/rest/vouchers/' + $scope.voucher).success(function (res) {
                    console.log(res);
                    $scope.loadingVoucher = false;
                    if(res.valid && (res.subscriptionType === null || res.subscriptionType === $scope.order.type)) {
                        $scope.successVoucher = true;
                        $scope.order.voucher = $scope.voucher;
                    } else {
                        $scope.errorVoucher = true;
                    }
                }).error(function (res) {
                    console.log(res);
                    $scope.loadingVoucher = false;
                    $scope.errorVoucher = true;
                });
            } else {
                $scope.formSignup.voucher.$setPristine();
                $scope.successVoucher = false;
                $scope.errorVoucher = false;
            }
        };

        $scope.changeType = function () {
            $scope.typeMessage = false;
        };

        $scope.signupSubmit = function () {
            if ($scope.order.type) {
                $scope.formSignup.$setPristine();
                $scope.error = null;
                $scope.errorMsg = '';
                $http.post($window.smmConfig.restUrlBase + '/api/membership/order', $scope.order).success(function (response) {

                    console.log(response);
                    $rootScope.userName = response.user.name;
                    $rootScope.$state.go('profile.account');

                }).error(function (response) {

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
