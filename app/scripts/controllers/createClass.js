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

        $scope.save = function (status) {
            $scope.showSpinner = true;
            $scope.class.status = status;
            $scope.class.$save({route: 'events'}).then(function (res) {
                console.log(res);
                $scope.showSpinner = false;
                $rootScope.$state.go('admin.classes.class', {classId: res.data.id});
            });
        };

        $scope.importTag = function (name) {
            console.log(name);
            $scope.class[name] = _.map($scope[name], function(tag) { return tag.text; });
        };

    });
