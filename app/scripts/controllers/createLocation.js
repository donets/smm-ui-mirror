'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:CreateLocationCtrl
 * @description
 * # CreateLocationCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.CreateLocation', [])
    .controller('CreateLocationCtrl', function ($scope, RestApi, getNeigbourhood) {

        $scope.location = new RestApi();

        $scope.neigbourhood = getNeigbourhood.data;

        $scope.save = function () {
            $scope.location.$save({route: 'locations'}).then(function (res) {
                console.log(res);
                $rootScope.$state.go('admin.location', {locationId: res.id});
            });
        };

    });
