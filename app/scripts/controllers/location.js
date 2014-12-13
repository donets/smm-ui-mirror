'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:LocationCtrl
 * @description
 * # LocationCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Location', [])
    .controller('LocationCtrl', function ($scope, getLocation, getNeigbourhood) {

        getLocation.$promise.then(function () {
            $scope.location = getLocation;
        });

        $scope.neigbourhood = getNeigbourhood.data;

        $scope.save = function () {
            $scope.location.$update({route: 'locations'}).then(function (res) {
                console.log(res);
            });
        };

    });
