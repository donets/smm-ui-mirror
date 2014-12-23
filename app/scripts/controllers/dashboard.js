'use strict';

/**
 * @ngdoc function
 * @name boltApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the boltApp
 */
angular.module('boltApp.controllers.Dashboard', [])
    .controller('DashboardCtrl', function ($scope, getClasses, getOccurrences, getStudios, getNeigbourhood, $q) {
        $q.all([getClasses.$promise, getOccurrences.$promise, getStudios.$promise]).then(function (res) {
            $scope.studios = res[2];
            _.map(res[0], function (obj) {
                obj.studio = obj.studioId ? _.findWhere(res[2], {id: obj.studioId}).name : '';
            });
            $scope.events = _.each(res[1], function (event) {
                event.class = _.findWhere(res[0], {id: event.parent_event_id});
            });
        });
        $scope.neigbourhood = getNeigbourhood.data;
        $scope.clearFilters = function () {
            $scope.search = {
                class: {
                    title: '',
                    teacherName: ''
                }
            };
        };
        $scope.clearFilters();
    });
