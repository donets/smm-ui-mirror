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
                        $scope.formSignup.voucher.$setValidity('valid', true);
                    } else {
                        $scope.errorVoucher = true;
                        $scope.formSignup.voucher.$setValidity('valid', false);
                    }
                }).error(function (res) {
                    console.log(res);
                    $scope.loadingVoucher = false;
                    $scope.errorVoucher = true;
                    $scope.formSignup.voucher.$setValidity('valid', false);
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
                $http.post($window.smmConfig.restUrlBase + '/api/membership/order', $scope.order).success(function (response) {

                    console.log(response);
                    $rootScope.userName = response.user.name;
                    $rootScope.$state.go('profile.account');

                }).error(function (response, status) {
                    console.error(status);
                    $scope.error = response.type;
                    $scope.errorMsg = response.message;
                });
            } else {
                $document.scrollToElementAnimated($('#cards'), 0, 800);
                $scope.typeMessage = true;
            }
        };
        
    });
