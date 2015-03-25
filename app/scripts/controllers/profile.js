'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Profile', [])
    .controller('ProfileCtrl', function ($scope, $rootScope, $window, $http, $modal, getMembership, getCards) {

        var getVoucher = function (code) {
            $http.get($window.smmConfig.restUrlBase + '/api/rest/vouchers/' + code).success(function (res) {
                console.log(res);
                $scope.voucher = res;
            }).error(function (res) {
                console.log(res);
                $scope.voucher = null;
            });
        };

        getMembership.$promise.then(function () {
            $scope.membership = getMembership.membership;
            console.log($scope.membership);
            $scope.membership.type = $scope.membership.current.type || $scope.membership.nextPeriod.type;
            if ($scope.membership.discountGranted) {
                getVoucher($scope.membership.discount.voucherCode);
            }
            $scope.overview = {
                card: _.findWhere($scope.cards, {type: $scope.membership.type}).name,
                price: _.findWhere($scope.cards, {type: $scope.membership.type}).price
            };
            $scope.member = {
                name: $scope.membership.firstName + ' ' + $scope.membership.lastName,
                email: $scope.membership.email
            };
        });

        $scope.password = {};
        $scope.notChanged = true;
        $scope.cards = getCards.data;

        $scope.changePass = function (formPass) {
            $scope.loading = true;
            $scope.errorPass = false;
            $scope.successPass = false;
            $rootScope.handledError = true;
            $http.get($window.smmConfig.restUrlBase + '/api/auth/changePassword?oldPassword=' + $scope.password.old + '&newPassword=' + $scope.password.new).success(function (response) {
                console.log(response);
                $rootScope.handledError = false;
                $scope.loading = false;
                $scope.successPass = true;
                $scope.password = {};
                formPass.$setPristine();
            }).error(function (response) {
                console.log(response);
                $rootScope.handledError = false;
                $scope.loading = false;
                $scope.errorPass = response.type;
            });
        };

        $scope.upload = function (target) {
            $scope.modalInstance = $modal.open({
                templateUrl: 'views/modalUpload.html',
                controller: function ($scope, target, $window, $modalInstance, $interval) {

                    $scope.target = target;
                    $scope.$window = $window;
                    $scope.photo = {};

                    $scope.close = function () {
                        $modalInstance.dismiss('close');
                    };

                    $scope.uploader = {
                        success: function ($flow, $file, $message) {
                            var message = angular.fromJson($message);
                            $interval(function () {
                                $modalInstance.close(message.url);
                            }, 1000, 1, {invokeApply: false});
                        }
                    };


                },
                backdrop: 'static',
                windowClass: 'modal-upload',
                resolve: {
                    target: function () {
                        return target;
                    }
                }
            }).result.then(function (url) {
                    if(url) {
                        $scope.membership.photo = url;
                    }
                });
        };

        $scope.cancelMembership = function () {
            $modal.open({
                templateUrl: 'views/modalCancel.html',
                controller: ['$scope', '$modalInstance', '$http', '$window', 'name', 'email', '$interval',

                    function ($scope, $modalInstance, $http, $window, name, email, $interval) {

                        $scope.message = {
                            name: name,
                            email: email,
                            message: 'cancel membership'
                        };

                        $scope.submitMessage = function() {
                            $scope.loading = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/message', $scope.message).success(function () {
                                $scope.loading = false;
                                $scope.success = true;
                                $interval(function () {
                                    $modalInstance.close(true);
                                }, 0, 1, {invokeApply: false});
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
                windowClass: 'modal-cancel',
                resolve: {
                    name: function () {
                        return $scope.member.name;
                    },
                    email: function () {
                        return $scope.member.email;
                    }
                }
            }).result.then(function(result) {
                if (result) {
                    $scope.messageNotAvailable = true; 
                }
            });
        };

        $scope.changeCard = function () {
            $scope.notChanged = false;
        };

        $scope.changeMembership = function(type) {
            $scope.loading = true;
            $scope.member.message = 'change membership to ' + type + ' card';
            $http.post($window.smmConfig.restUrlBase + '/api/message', $scope.member).success(function () {
                $scope.loading = false;
                $scope.notChanged = true;
                $scope.messageNotAvailable = true;
            }).error(function (response, status) {
                $scope.loading = false;
                $scope.messageNotDelivered = true;
                console.error(status);
            });
        };

    });

