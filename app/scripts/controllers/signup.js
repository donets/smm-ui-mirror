'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Signup', [])
    .controller('SignupCtrl', function ($scope, $rootScope, $q, $http, $window, getStudios, Membership) {
        $scope.studios = getStudios.data;
        $scope.order = {
            deliveryAddress: {
                countryCode: 'DE'
            }
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

        $scope.signupSubmit = function () {
            if (!$rootScope.userName) {
                createUser($scope.newUser).then(function () {
                    createOrder($scope.order);
                });
            } else {
                createOrder($scope.order);
            }
        };
        
        var createUser = function (user) {
            var def = $q.defer();
            $http.get($window.smmConfig.restUrlBase + '/api/auth/signupAndLogin?name=' + user.name + ' ' + user.surname + '&email=' + user.email + '&password=' + user.password).success(function (response) {
                console.log(response);
                $rootScope.userName = response.user.name;
                def.resolve();
            }).error(function (response, status) {
                console.error(response);
                console.error(status);
                $scope.errorLogin = true;
                def.reject();
            });
            return def.promise;
        };

        var createOrder = function (order) {
            console.log(order);
        };

        $scope.newsletterChecked = true;
        
    });
