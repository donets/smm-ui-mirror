'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:CreateClassCtrl
 * @description
 * # CreateClassCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.CreateClass', [])
    .controller('CreateClassCtrl', function ($scope, $rootScope, getLocations, getStudios, RestApi) {
        getLocations.$promise.then(function () {
            $scope.locations = getLocations;
        });
        getStudios.$promise.then(function () {
            $scope.studios = getStudios;
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

        $scope.importTag = function (name) {
            console.log(name);
            $scope.class[name] = _.map($scope[name], function(tag) { return tag.text; });
        };

    });
