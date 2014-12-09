'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:CreateClassCtrl
 * @description
 * # CreateClassCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.CreateClass', [])
    .controller('CreateClassCtrl', function ($scope, $rootScope, getLocations, RestApi) {
        getLocations.$promise.then(function () {
            $scope.locations = getLocations;
        });
        $scope.levels = [
            'Anfänger',
            'Medium',
            'Fortgeschrittene'
        ];
        $scope.class = new RestApi();

        $scope.saveDraft = function () {
            $scope.class.$save({route: 'events'}).then(function (res) {
                console.log(res);
                $rootScope.$state.go('admin.class', {classId: res.id});
            });
        };

    });
