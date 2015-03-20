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
            RestApi.query({route: 'cities'}).$promise.then(function (res) {
                $scope.membership.city = _.findWhere(res, {id: $scope.membership.cityId});
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

        $scope.activateMembership = function () {
            $modal.open({
                templateUrl: 'views/modalActivate.html',
                controller: ['$scope', '$modalInstance', '$http', '$window', 'member', '$state',

                    function ($scope, $modalInstance, $http, $window, member, $state) {

                        $scope.member = member;

                        $scope.showDatepicker = {};

                        $scope.openDatepicker = function($event, type) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.showDatepicker[type] = true;
                        };
                        $scope.minStartDate = member.earliestActivationPossible ? moment(member.earliestActivationPossible).format() : moment().format();
                        $scope.dateOptions = {
                            startingDay: 1,
                            showWeekNumbers: false,
                            showWeeks: false
                        };

                        $scope.step_1 = true;

                        $scope.activateSubmit = function() {
                            $scope.loading = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/membership/' + member.id + '/activate', {}, {params: {from: moment($scope.startDate).format('YYYY-MM-DD')}}).success(function (res) {
                                console.log(res);
                                $scope.loading = false;
                                $scope.step_1 = false;
                                $scope.success = true;
                            }).error(function (res) {
                                console.log(res);
                                $scope.loading = false;
                            });
                        };

                        $scope.close = function () {
                            $modalInstance.close(false);
                            $state.go($state.$current, null, { reload: true })
                        };

                    }],
                backdrop: 'static',
                windowClass: 'modal-cancel',
                resolve: {
                    member: function () {
                        return $scope.membership;
                    }
                }
            });
        };

        var suspend = $scope.suspendMembership = function () {
            $modal.open({
                templateUrl: 'views/modalSuspend.html',
                controller: ['$scope', '$modalInstance', '$http', '$window', 'member', 'gettextCatalog', '$state',

                    function ($scope, $modalInstance, $http, $window, member, gettextCatalog, $state) {

                        $scope.showDatepicker = {};

                        $scope.openDatepicker = function($event, type) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            $scope.showDatepicker[type] = true;
                        };
                        $scope.minStartDate = member.earliestPausePossible ? moment(member.earliestPausePossible).format() : moment().format();
                        $scope.activateDateList = [];
                        for( var i = 1; i <= 3; i++ ){
                            $scope.activateDateList.push({id: i, date: gettextCatalog.getPlural(i, "In {{count}} month", "In {{count}} months", {count: i})});
                        }
                        $scope.durationMonths = 1;
                        $scope.dateOptions = {
                            startingDay: 1,
                            showWeekNumbers: false,
                            showWeeks: false
                        };

                        $scope.step_1 = true;

                        $scope.suspendSubmit = function() {
                            $scope.loading = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/membership/' + member.id + '/schedulePause', {}, {params: {from: moment($scope.startDate).format('YYYY-MM-DD'), durationMonths: $scope.durationMonths}}).success(function (res) {
                                console.log(res);
                                $scope.loading = false;
                                $scope.step_1 = false;
                                $scope.success = true;
                                $scope.activateDate = moment($scope.startDate).add($scope.durationMonths, 'M').format();
                            }).error(function (res) {
                                console.log(res);
                                $scope.loading = false;
                            });
                        };

                        $scope.close = function () {
                            $modalInstance.close(false);
                            $state.go($state.$current, null, { reload: true })
                        };

                    }],
                backdrop: 'static',
                windowClass: 'modal-cancel',
                resolve: {
                    member: function () {
                        return $scope.membership;
                    }
                }
            });
        };

        $scope.cancelMembership = function () {
            $modal.open({
                templateUrl: 'views/modalCancel.html',
                controller: ['$scope', '$modalInstance', '$http', '$window', 'member', '$state',

                    function ($scope, $modalInstance, $http, $window, member, $state) {

                        $scope.step_1 = true;

                        $scope.cancelSubmit = function() {
                            $scope.loading = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/membership/' + member.id + '/cancel').success(function (res) {
                                console.log(res);
                                $scope.loading = false;
                                $scope.step_1 = false;
                                $scope.step_2 = true;
                                $scope.cancellationDate = res.cancellationDate;
                            }).error(function (res) {
                                console.log(res);
                                $scope.loading = false;
                            });
                        };

                        $scope.suspendSubmit = function () {
                            $modalInstance.close(false);
                            suspend();
                        };

                        $scope.sendMessage = function (reason) {
                            $scope.loading = true;
                            $http.post($window.smmConfig.restUrlBase + '/api/message', {message: reason, email: member.email}).success(function () {
                                $scope.loading = false;
                                $scope.step_2 = false;
                                $scope.success = true;
                            }).error(function (response, status) {
                                $scope.loading = false;
                                console.error(status);
                            });
                        };

                        $scope.close = function () {
                            $modalInstance.close(false);
                            $state.go($state.$current, null, { reload: true })
                        };

                    }],
                backdrop: 'static',
                windowClass: 'modal-cancel',
                resolve: {
                    member: function () {
                        return $scope.membership;
                    }
                }
            });
        };

        $scope.paymentUpdateSuccess = function () {
            $modal.open({
                templateUrl: 'views/modalSuccess.html',
                controller: ['$scope', '$modalInstance', '$state',

                    function ($scope, $modalInstance, $state) {

                        $scope.close = function () {
                            $modalInstance.close(false);
                            $state.go($state.$current, null, { reload: true })
                        };

                    }],
                backdrop: 'static',
                windowClass: 'modal-cancel'
            });
        };

        $scope.Math = $window.Math;
        $scope.month = _.range(1, 13);
        $scope.year = _.range(2014, 2033);

        $scope.order = {
            paymentProvider: 'STRIPE'
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

        $scope.changePaymentSubmit = function() {
            $scope.showSpinner = true;
            $http.post($window.smmConfig.restUrlBase + '/api/membership/' + $scope.membership.id + '/updatePaymentData', $scope.order).success(function (res) {
                console.log(res);
                $scope.showSpinner = false;
                $scope.success = true;
                $scope.paymentUpdateSuccess();
            }).error(function (res) {
                console.log(res);
                $scope.showSpinner = false;
            });
        };

    });

