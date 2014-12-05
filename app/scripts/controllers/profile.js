'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Profile', [])
    .controller('ProfileCtrl', function ($scope, $window, $http, getMembership) {
        getMembership.$promise.then(function () {
            $scope.membership = getMembership.membership;
            $scope.type = $scope.membership.current.type || $scope.membership.nextPeriod.type;
        });

        $scope.password = {};

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

    });

