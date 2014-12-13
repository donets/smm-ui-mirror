'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:LocationsCtrl
 * @description
 * # LocationsCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Locations', [])
    .controller('LocationsCtrl', function ($scope, getLocations) {
        getLocations.$promise.then(function (res) {
            $scope.locations = res;
        });
    });
