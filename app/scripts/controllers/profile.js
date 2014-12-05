'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Profile', [])
    .controller('ProfileCtrl', function ($scope, $window, $http, $modal, getMembership) {
        getMembership.$promise.then(function () {
            $scope.membership = getMembership.membership;
            console.log($scope.membership);
            $scope.type = $scope.membership.current.type || $scope.membership.nextPeriod.type;
            $scope.member = {
                name: $scope.membership.firstName + ' ' + $scope.membership.lastName,
                email: $scope.membership.email
            };
        });

        $scope.password = {};
        $scope.notChanged = true;

        $scope.changePass = function (formPass) {
            $scope.loading = true;
            $scope.errorPass = false;
            $scope.successPass = false;
            $http.get($window.smmConfig.restUrlBase + '/api/auth/changePassword?oldPassword=' + $scope.password.old + '&newPassword=' + $scope.password.new).success(function (response) {
                console.log(response);
                $scope.loading = false;
                $scope.successPass = true;
                $scope.password = {};
                formPass.$setPristine();
            }).error(function (response) {
                console.log(response);
                $scope.loading = false;
                $scope.errorPass = response.type;
            });
        };

        $scope.cancelMembership = function () {
            $modal.open({
                templateUrl: 'views/modalCancel.html',
                controller: ['$scope', '$modalInstance', '$http', '$window', 'name', 'email',

                    function ($scope, $modalInstance, $http, $window, name, email) {

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
                                setTimeout(function () {
                                    $modalInstance.close(true);
                                }, 0);
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

