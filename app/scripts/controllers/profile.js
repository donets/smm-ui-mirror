'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Profile', [])
    .controller('ProfileCtrl', function ($scope, getMembership) {
        getMembership.$promise.then(function () {
            $scope.membership = getMembership.membership;
            $scope.type = $scope.membership.nextPeriod.type;
        });
    });

