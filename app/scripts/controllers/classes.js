'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ClassesCtrl
 * @description
 * # ClassesCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Classes', [])
    .controller('ClassesCtrl', function ($scope, $q, getClasses, getStudios) {
        $q.all([getClasses.$promise, getStudios.$promise]).then(function (res) {
            $scope.classes = res[0];
            $scope.studios = res[1];
            _.map($scope.classes, function (obj) {
                var studio = _.findWhere($scope.studios, {id: obj.studioId});
                obj.studio = obj.studioId && studio ? studio.name : '';
            });
        });
        $scope.clearFilters = function () {
            $scope.search = {};
        };
        $scope.clearFilters();
        $scope.levels = [
            {id: 1, text: 'Anfänger'},
            {id: 2, text: 'Medium'},
            {id: 3, text: 'Fortgeschrittene'}
        ];
    });
