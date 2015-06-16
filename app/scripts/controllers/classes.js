'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:ClassesCtrl
 * @description
 * # ClassesCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Classes', [])
    .controller('ClassesCtrl', function ($scope, $q, getClasses, getStudios, gettextCatalog) {
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
            {id: '1', text: gettextCatalog.getString('Beginners')},
            {id: '2', text: gettextCatalog.getString('Medium')},
            {id: '3', text: gettextCatalog.getString('Advanced')}
        ];
        $scope.limit = 10;
        $scope.showMore = function () {
            $scope.limit += 5;
        };
    });
