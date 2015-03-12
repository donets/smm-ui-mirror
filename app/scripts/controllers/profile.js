'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Profile', [])
    .controller('ProfileCtrl', function ($scope, $rootScope, $window, $http, $modal, RestApi, getMembership) {

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
            $scope.membership.type = $scope.membership.current.type || $scope.membership.nextPeriod.type;
            RestApi.query({route: 'plans', cityId: $scope.membership.cityId}).$promise.then(function (res) {
                $scope.cards = res;
                $scope.currentCard = _.findWhere($scope.cards, {code: $scope.membership.type});
            });
            if ($scope.membership.discountGranted) {
                getVoucher($scope.membership.discount.voucherCode);
            }
            console.log($scope.membership);
        });

        $scope.password = {};
        $scope.notChanged = true;

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
                controller: function ($scope, target, $window, $modalInstance) {

                    $scope.target = target;
                    $scope.$window = $window;
                    $scope.photo = {};

                    $scope.close = function () {
                        $modalInstance.dismiss('close');
                    };

                    $scope.uploader = {
                        success: function ($flow, $file, $message) {
                            var message = angular.fromJson($message);
                            setTimeout(function () {
                                $modalInstance.close(message.url);
                            }, 1000);
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
                controller: ['$scope', '$modalInstance', '$http', '$window', 'userId',

                    function ($scope, $modalInstance, $http, $window, userId) {

                        $scope.step_1 = true;

                        $scope.cancelSubmit = function() {
                            $scope.loading = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/membership/' + userId + '/cancel').success(function (res) {
                                console.log(res);
                                $scope.loading = false;
                                $scope.success = true;
                                $scope.step_1 = false;
                                $scope.cancellationDate = res.cancellationDate;
                            }).error(function (res) {
                                console.log(res);
                                $scope.loading = false;
                            });
                        };

                        $scope.close = function () {
                            $modalInstance.close(false);
                        };

                    }],
                backdrop: 'static',
                windowClass: 'modal-cancel',
                resolve: {
                    userId: function () {
                        return $scope.membership.id;
                    }
                }
            });
        };

    });

